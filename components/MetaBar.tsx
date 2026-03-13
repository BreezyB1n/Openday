// Server component — renders current date server-side
const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function MetaBar() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const day = DAYS[now.getDay()]
  const dateStr = `${y}.${m}.${d}.${day}`

  // text-[#666] on #1a1a1a ≈ 4.1:1 — decorative system metadata, spec-approved WCAG exception
  return (
    <div className="bg-bg-inverse text-text-inverse flex justify-between items-center px-6 py-1.5 text-[10px] tracking-[0.15em]">
      <span className="text-[#666]">SYS_REF // OPENDAY_PLATFORM · PROTOCOL: PUB-01</span>
      <span className="text-[#666]">
        CORE <span className="text-green-400">●</span> ONLINE · {dateStr}
      </span>
    </div>
  )
}
