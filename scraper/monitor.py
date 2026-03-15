#!/usr/bin/env python3
"""
monitor.py — 定时监控 programs.json 中各 program 的申请状态。

只更新动态字段 (status, updatedAt)，不触碰静态字段（课程、要求等）。

Usage:
    python monitor.py                          # dry-run，仅打印变化
    python monitor.py --apply                  # 写回 programs.json
    python monitor.py --apply --json ../data/programs.json
"""

import argparse
import json
import ssl
import sys
import warnings
from datetime import datetime, timezone
from pathlib import Path

try:
    import requests
    from requests.adapters import HTTPAdapter
    from requests.exceptions import SSLError
    from urllib3.util.ssl_ import create_urllib3_context
except ImportError:
    raise SystemExit("requests is required. Run: pip install requests")

try:
    from bs4 import BeautifulSoup
except ImportError:
    raise SystemExit("beautifulsoup4 is required. Run: pip install beautifulsoup4 lxml")


class LegacySSLAdapter(HTTPAdapter):
    """HTTPAdapter that allows legacy/broken TLS servers (e.g. SSL EOF on handshake)."""

    def init_poolmanager(self, *args, **kwargs):
        ctx = create_urllib3_context()
        # Allow older TLS configs; disables strict EOF checking
        ctx.options |= getattr(ssl, "OP_LEGACY_SERVER_CONNECT", 0x4)
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        kwargs["ssl_context"] = ctx
        super().init_poolmanager(*args, **kwargs)


def _make_session(legacy_ssl: bool = False) -> requests.Session:
    s = requests.Session()
    if legacy_ssl:
        adapter = LegacySSLAdapter()
        s.mount("https://", adapter)
    return s


SCRIPT_DIR = Path(__file__).parent
DEFAULT_JSON = SCRIPT_DIR.parent / "data" / "programs.json"

REQUEST_TIMEOUT = 15  # seconds
VERBOSE_TEXT_PREVIEW = 300  # chars shown in verbose mode
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; OpendayMonitor/1.0; +https://openday.app)"
    )
}

# Set by --verbose flag
_verbose = False


def vprint(*args, **kwargs) -> None:
    if _verbose:
        print(*args, **kwargs)

OPEN_KEYWORDS = [
    "now open",
    "applications open",
    "apply now",
    "accepting applications",
]
CLOSED_KEYWORDS = [
    "closed",
    "no longer accepting",
    "applications closed",
    "deadline passed",
]
PENDING_KEYWORDS = [
    "coming soon",
    "opening soon",
    "not yet open",
    "will open",
]


def infer_status(text: str) -> str | None:
    """Return inferred status string, or None if uncertain."""
    lower = text.lower()
    if any(kw in lower for kw in OPEN_KEYWORDS):
        return "open"
    if any(kw in lower for kw in CLOSED_KEYWORDS):
        return "closed"
    if any(kw in lower for kw in PENDING_KEYWORDS):
        return "pending"
    return None


def _do_get(url: str, session: requests.Session | None = None, verify: bool = True) -> requests.Response:
    """Low-level GET, raises on error. Logs redirect chain in verbose mode."""
    s = session or requests.Session()
    resp = s.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT, verify=verify)
    if _verbose and resp.history:
        chain = " → ".join(r.url for r in resp.history) + f" → {resp.url}"
        vprint(f"      redirects: {chain}")
    vprint(f"      final url: {resp.url}  status: {resp.status_code}  size: {len(resp.content)} bytes")
    resp.raise_for_status()
    return resp


def fetch_text(url: str, selector: str | None) -> tuple[str, str]:
    """
    Fetch URL and extract text.
    Returns (text, error_message). On success error_message is empty.
    On SSL EOF error, retries with legacy TLS adapter (handles broken server configs).
    """
    warn_parts: list[str] = []
    resp = None
    try:
        resp = _do_get(url)
    except SSLError as ssl_err:
        vprint(f"      SSL error: {ssl_err}")
        # Retry with legacy TLS — handles SSL_UNEXPECTED_EOF and old server configs
        warn_parts.append("SSL error, retried with legacy TLS adapter")
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                resp = _do_get(url, session=_make_session(legacy_ssl=True), verify=False)
        except requests.exceptions.RequestException as e2:
            return "", f"SSL error (legacy retry also failed): {e2}"
    except requests.exceptions.Timeout:
        return "", f"timeout after {REQUEST_TIMEOUT}s"
    except requests.exceptions.HTTPError as e:
        return "", f"HTTP {e.response.status_code}"
    except requests.exceptions.RequestException as e:
        return "", str(e)

    soup = BeautifulSoup(resp.text, "lxml")

    if selector:
        element = soup.select_one(selector)
        if element:
            text = element.get_text(separator=" ", strip=True)
            vprint(f"      selector '{selector}' matched. text preview: {text[:VERBOSE_TEXT_PREVIEW]!r}")
            return text, "; ".join(warn_parts)
        # Selector didn't match — fall back to full body
        warn_parts.append(f"selector '{selector}' not found, used full body")
        vprint(f"      selector '{selector}' NOT found in page")

    body = soup.body
    text = body.get_text(separator=" ", strip=True) if body else ""
    vprint(f"      body text preview: {text[:VERBOSE_TEXT_PREVIEW]!r}")
    return text, "; ".join(warn_parts)


def check_program(program: dict) -> dict:
    """
    Check a single program's status.

    Returns a result dict with keys:
        id, name, school, old_status, new_status, changed, error, warning
    """
    pid = program.get("id", "?")
    name = program.get("name", "?")
    school = program.get("school", "?")
    old_status = program.get("status", "unknown")
    monitor_url = program.get("monitorUrl", "")
    monitor_selector = program.get("monitorSelector")

    result = {
        "id": pid,
        "name": name,
        "school": school,
        "old_status": old_status,
        "new_status": old_status,  # default: no change
        "changed": False,
        "error": "",
        "warning": "",
    }

    if not monitor_url:
        result["warning"] = "no monitorUrl"
        return result

    vprint(f"    url: {monitor_url}")
    if monitor_selector:
        vprint(f"    selector: {monitor_selector}")
    text, err = fetch_text(monitor_url, monitor_selector)

    if err and not text:
        result["error"] = err
        return result

    if err:
        result["warning"] = err

    inferred = infer_status(text)
    if inferred is None:
        result["warning"] = (result["warning"] + "; uncertain status").lstrip("; ")
        return result

    result["new_status"] = inferred
    result["changed"] = inferred != old_status
    return result


def print_results(results: list[dict]) -> None:
    changed = [r for r in results if r["changed"]]
    errors = [r for r in results if r["error"]]
    warnings = [r for r in results if r["warning"] and not r["error"]]

    print(f"\n{'='*60}")
    print(f"Monitor results — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")
    print(f"  Total:   {len(results)}")
    print(f"  Changed: {len(changed)}")
    print(f"  Errors:  {len(errors)}")
    print(f"  Warnings:{len(warnings)}")
    print()

    if changed:
        print("CHANGED:")
        for r in changed:
            print(
                f"  [{r['school']}] {r['name']}\n"
                f"    {r['old_status']} → {r['new_status']}"
            )
        print()

    if errors:
        print("ERRORS:")
        for r in errors:
            print(f"  [{r['school']}] {r['name']}: {r['error']}")
        print()

    if warnings:
        print("WARNINGS:")
        for r in warnings:
            print(f"  [{r['school']}] {r['name']}: {r['warning']}")
        print()

    print("ALL:")
    for r in results:
        tag = "✓" if not r["error"] and not r["warning"] else ("✗" if r["error"] else "⚠")
        status_str = r["new_status"]
        if r["changed"]:
            status_str = f"{r['old_status']} → {r['new_status']} ★"
        print(f"  {tag} [{r['school']}] {r['name']}: {status_str}")
    print()


def apply_changes(programs: list[dict], results: list[dict]) -> int:
    """Mutate programs in-place with new status and updatedAt. Returns change count."""
    now = datetime.now(timezone.utc).isoformat()
    result_by_id = {r["id"]: r for r in results}
    count = 0
    for program in programs:
        r = result_by_id.get(program.get("id"))
        if r and r["changed"] and not r["error"]:
            program["status"] = r["new_status"]
            program["updatedAt"] = now
            count += 1
    return count


def main() -> None:
    global _verbose

    parser = argparse.ArgumentParser(description="Monitor program application status")
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write status changes back to programs.json (default: dry-run)",
    )
    parser.add_argument(
        "--json",
        dest="json_path",
        default=str(DEFAULT_JSON),
        help=f"Path to programs.json (default: {DEFAULT_JSON})",
    )
    parser.add_argument(
        "--verbose", "-v",
        action="store_true",
        help="Print HTTP details, redirect chain, and extracted text preview for diagnosis",
    )
    args = parser.parse_args()
    _verbose = args.verbose

    json_path = Path(args.json_path)
    if not json_path.exists():
        raise SystemExit(f"programs.json not found: {json_path}")

    with open(json_path, encoding="utf-8") as f:
        programs = json.load(f)

    print(f"Loaded {len(programs)} programs from {json_path}")
    print("Checking status (this may take a while)...\n")

    results = []
    for i, program in enumerate(programs, 1):
        name = program.get("name", "?")
        school = program.get("school", "?")
        print(f"[{i}/{len(programs)}] {school} — {name}", end=" ", flush=True)
        r = check_program(program)
        status_label = r["error"] or r["new_status"]
        print(f"→ {status_label}")
        results.append(r)

    print_results(results)

    if args.apply:
        count = apply_changes(programs, results)
        if count:
            with open(json_path, "w", encoding="utf-8") as f:
                json.dump(programs, f, ensure_ascii=False, indent=2)
            print(f"✓ Applied {count} change(s) to {json_path}")
        else:
            print("No changes to apply.")
    else:
        changed_count = sum(1 for r in results if r["changed"])
        if changed_count:
            print(
                f"Dry-run: {changed_count} change(s) detected. "
                "Run with --apply to write them."
            )
        else:
            print("Dry-run: no status changes detected.")


if __name__ == "__main__":
    main()
