import Link from 'next/link'
import { Program, Degree } from '@/lib/types'
import StatusBadge from '@/components/StatusBadge'
import CountdownTimer from '@/components/CountdownTimer'

type Props = {
  program: Program
  index?: number
}

const degreeLabel: Record<Degree, string> = {
  bachelor: 'BACHELOR',
  master: 'MASTER',
  phd: 'PHD',
}

function formatDeadlineCompact(deadline: string | null): string {
  if (!deadline) return 'TBD'
  return deadline.replace(/-/g, '.')
}

export default function ProgramCard({ program, index }: Props) {
  const refNum = index !== undefined ? String(index + 1).padStart(3, '0') : '---'

  return (
    <Link href={`/programs/${program.id}`} className="block bg-bg-primary hover:bg-bg-secondary transition-colors group">
      <div className="p-4 h-full flex flex-col">
        {/* REF + country */}
        <div className="text-[9px] tracking-[0.08em] text-text-muted mb-2">
          REF_{refNum} // {program.country}
        </div>

        {/* School */}
        <div className="text-[11px] font-bold tracking-[0.05em] mb-1">
          {program.school.toUpperCase()}
        </div>

        {/* Program name */}
        <div className="text-[12px] font-sans text-text-secondary mb-3 leading-snug flex-1">
          {program.name} · {degreeLabel[program.degree]}
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <StatusBadge status={program.status} />
          <span className="text-[9px] tracking-[0.08em] px-1.5 py-0.5 border border-border-light text-text-muted">
            {degreeLabel[program.degree]}
          </span>
          <span className="text-[9px] tracking-[0.08em] px-1.5 py-0.5 border border-border-light text-text-muted">
            {program.field.toUpperCase().slice(0, 8)}
          </span>
        </div>

        {/* Deadline row: date left, countdown right */}
        <div className="flex items-center justify-between border-t border-border-light pt-2">
          <span className="text-[10px] text-text-secondary">
            DDL: {formatDeadlineCompact(program.deadline)}
          </span>
          <CountdownTimer deadline={program.deadline} />
        </div>
      </div>
    </Link>
  )
}
