import { ProgramStatus } from '@/lib/types'

type Props = {
  status: ProgramStatus
}

const statusConfig: Record<ProgramStatus, { label: string; className: string }> = {
  open: {
    label: 'OPEN',
    className: 'text-accent-green border-accent-green bg-green-50',
  },
  closed: {
    label: 'CLOSED',
    className: 'text-text-secondary border-border',
  },
  pending: {
    label: 'PENDING',
    className: 'text-accent-yellow border-yellow-300 bg-yellow-50',
  },
}

export default function StatusBadge({ status }: Props) {
  const { label, className } = statusConfig[status] ?? statusConfig.pending

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 border text-[9px] tracking-[0.08em] font-mono ${className}`}
      aria-label={status === 'open' ? '申请开放' : status === 'closed' ? '已截止' : '待定'}
    >
      {label}
    </span>
  )
}
