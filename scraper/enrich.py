#!/usr/bin/env python3
"""
enrich.py — Reads universities.yaml and generates programs.json with full fields.

Usage:
    python enrich.py --json-output <path>

Run from: scraper/ directory
"""

import argparse
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

try:
    import yaml
except ImportError:
    raise SystemExit("PyYAML is required. Run: pip install pyyaml")


SCRIPT_DIR = Path(__file__).parent
CONFIG_DIR = SCRIPT_DIR / "config"

# Fields to pass through from YAML program config directly into output
YAML_OVERRIDE_FIELDS = (
    "apply_url",
    "monitor_url",
    "monitor_selector",
    "deadline",
    "status",
    "language_req",
    "gpa_req",
    "fee",
    "description",
    "internship_credit",
    "work_auth_note",
)

# Mapping from YAML snake_case keys to JSON camelCase keys
CAMEL_MAP = {
    "apply_url": "applyUrl",
    "monitor_url": "monitorUrl",
    "monitor_selector": "monitorSelector",
    "language_req": "languageReq",
    "gpa_req": "gpaReq",
    "internship_credit": "internshipCredit",
    "work_auth_note": "workAuthNote",
}


def to_camel(key: str) -> str:
    return CAMEL_MAP.get(key, key)


def load_yaml(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return yaml.safe_load(f)


def enrich_programs(config: dict) -> list[dict]:
    json_results: list[dict] = []
    now = datetime.now(timezone.utc).isoformat()

    for university in config.get("universities", []):
        school = university["name"]
        country = university["country"]

        for program_cfg in university.get("programs", []):
            merged: dict = {
                "id": str(uuid.uuid4()),
                "name": program_cfg["name"],
                "school": school,
                "country": country,
                "degree": program_cfg["degree"],
                "field": program_cfg["field"],
                "updatedAt": now,
            }

            # Pass through and camelCase the override fields
            for key in YAML_OVERRIDE_FIELDS:
                val = program_cfg.get(key)
                if val is not None:
                    merged[to_camel(key)] = val

            # Handle list field core_courses separately
            core_courses = program_cfg.get("core_courses")
            if core_courses is not None:
                merged["coreCourses"] = core_courses

            json_results.append(merged)

    return json_results


def main() -> None:
    parser = argparse.ArgumentParser(description="Enrich program data from YAML config")
    parser.add_argument(
        "--json-output",
        required=True,
        help="Output path for programs.json",
    )
    args = parser.parse_args()

    config_path = CONFIG_DIR / "universities.yaml"
    if not config_path.exists():
        raise SystemExit(f"Config not found: {config_path}")

    config = load_yaml(config_path)
    programs = enrich_programs(config)

    output_path = Path(args.json_output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(programs, f, ensure_ascii=False, indent=2)

    print(f"✓ Wrote {len(programs)} programs to {output_path}")

    # Quick validation
    missing_id = [p for p in programs if not p.get("id")]
    missing_updated = [p for p in programs if not p.get("updatedAt")]
    if missing_id:
        print(f"⚠ {len(missing_id)} programs missing 'id'")
    if missing_updated:
        print(f"⚠ {len(missing_updated)} programs missing 'updatedAt'")

    field_counts = [len(p) for p in programs]
    min_fields = min(field_counts)
    print(f"✓ Min fields per record: {min_fields} (required: ≥12)")


if __name__ == "__main__":
    main()
