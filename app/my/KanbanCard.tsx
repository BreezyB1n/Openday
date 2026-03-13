// app/my/KanbanCard.tsx
// A single kanban card showing: school + program, match scores,
// pending materials, and deadline/status footer.
import type { ApplicationRecord, Program, UserProfile } from '@/lib/types'
import { matchGpa, matchLanguage } from '@/lib/score-match'

// Deadline countdown helper
function deadlineDisplay(deadline: string | null): { text: string; urgent: boolean } {
  if (!deadline) return { text: '无截止日期', urgent: false }
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
  if (days < 0) return { text: '已截止', urgent: false }
  return { text: `截止 ${deadline} · 剩 ${days} 天`, urgent: days <= 30 }
}

type Props = {
  record: ApplicationRecord
  program: Program
  profile: UserProfile
  onUpdate: (updated: ApplicationRecord) => void
  onDelete: (id: string) => void
}

export default function KanbanCard({ record, program, profile, onUpdate, onDelete }: Props) {
  const gpaMatch   = matchGpa(program.gpaReq, profile.gpa)
  const langMatch  = matchLanguage(program.languageReq, profile)
  const deadline   = deadlineDisplay(program.deadline)
  const pendingMaterials = record.materials.filter(m => !m.done)
  const doneMaterials    = record.materials.filter(m => m.done)

  // Left border color by status/result.
  const borderClass =
    record.status === 'submitted' ? 'border-l-[3px] [border-left-color:var(--color-accent-blue)]' :
    record.result  === 'offer'    ? 'border-l-[3px] [border-left-color:var(--color-accent-green)]' :
    record.result  === 'declined' ? 'border-l-[3px] [border-left-color:var(--color-border)] opacity-50' :
    record.result  === 'waitlist' ? 'border-l-[3px] [border-left-color:var(--color-accent-yellow)]' : ''

  // Match result display
  const matchColor = (r: 'pass' | 'fail' | 'unknown') =>
    r === 'pass' ? 'text-accent-green' : r === 'fail' ? 'text-accent-orange' : 'text-text-muted'

  // Footer content
  function footerContent() {
    if (record.status === 'result') {
      if (!record.result) return <span className="text-accent-blue text-[9px] tracking-[0.05em]">等待结果中…</span>
      if (record.result === 'offer') return <span className="text-accent-green text-[9px] tracking-[0.05em]">OFFER · {record.resultAt}</span>
      if (record.result === 'declined') return <span className="text-text-muted text-[9px] tracking-[0.05em]">DECLINED · {record.resultAt}</span>
      return <span className="text-accent-yellow text-[9px] tracking-[0.05em]">WAITLIST · {record.resultAt}</span>
    }
    if (record.status === 'submitted') {
      return <span className="text-accent-blue text-[9px] tracking-[0.05em]">已提交 {record.submittedAt} · 等待结果</span>
    }
    return (
      <span className={`text-[9px] tracking-[0.05em] ${deadline.urgent ? 'text-accent-orange' : 'text-text-secondary'}`}>
        {deadline.text}
      </span>
    )
  }

  function toggleMaterial(name: string) {
    const updated = {
      ...record,
      materials: record.materials.map(m => m.name === name ? { ...m, done: !m.done } : m),
    }
    onUpdate(updated)
  }

  return (
    <div className={`bg-bg-primary border border-border ${borderClass} mb-1.5 hover:bg-bg-secondary transition-colors cursor-pointer`}>
      {/* Head */}
      <div className="px-3 pt-2.5 pb-2 border-b border-border">
        <div className="text-[13px] font-bold leading-tight mb-0.5">{program.school}</div>
        <div className="text-[10px] text-text-secondary font-sans leading-snug mb-1.5">{program.name}</div>
        <div className="flex gap-1">
          <span className="border border-border text-[8px] tracking-[0.1em] px-1.5 py-0.5 text-text-secondary bg-bg-secondary">
            {program.country}
          </span>
          <span className="border border-border text-[8px] tracking-[0.1em] px-1.5 py-0.5 text-text-secondary bg-bg-secondary capitalize">
            {program.degree}
          </span>
        </div>
      </div>

      {/* Match scores */}
      <div className="grid grid-cols-2 gap-px bg-border mx-0 border-b border-border">
        {[gpaMatch, langMatch].map(m => (
          <div key={m.label} className="bg-bg-primary px-2 py-1.5">
            <div className="text-[7px] tracking-[0.2em] text-text-muted mb-0.5">{m.label}</div>
            <div className="flex justify-between items-baseline">
              <span className="text-[9px] text-text-secondary">要求 {m.required}</span>
              <span className={`text-[9px] ${matchColor(m.result)}`}>
                我 {m.mine} {m.result === 'pass' ? '✓' : m.result === 'fail' ? '✗' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Materials — hidden in RESULT column */}
      {record.status !== 'result' && record.materials.length > 0 && (
        <div className="px-3 py-2 border-b border-border">
          <div className="text-[7px] tracking-[0.2em] text-text-muted mb-1.5">
            {record.status === 'submitted' ? '材料状态' : '待补材料'}
          </div>
          <div className="flex flex-wrap gap-1">
            {pendingMaterials.map(m => (
              <button
                key={m.name}
                onClick={(e) => { e.stopPropagation(); toggleMaterial(m.name) }}
                className="border border-accent-orange text-accent-orange text-[8px] tracking-[0.05em] px-1.5 py-0.5 hover:bg-bg-secondary transition-colors"
              >
                {m.name}
              </button>
            ))}
            {doneMaterials.map(m => (
              <button
                key={m.name}
                onClick={(e) => { e.stopPropagation(); toggleMaterial(m.name) }}
                className="border border-border text-text-muted text-[8px] tracking-[0.05em] px-1.5 py-0.5 line-through"
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-3 py-2 flex justify-between items-center">
        {footerContent()}
        <a
          href={program.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="text-[8px] tracking-[0.1em] border border-accent-blue text-accent-blue px-2 py-0.5 hover:bg-accent-blue hover:text-white transition-colors"
        >
          {record.status === 'planning' || record.status === 'preparing' ? '申请 →' : '查看 →'}
        </a>
      </div>
    </div>
  )
}
