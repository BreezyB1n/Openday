import { ProgramStatus } from '@/lib/types'

type Props = {
  status: ProgramStatus
}

const statusConfig: Record<ProgramStatus, { label: string; className: string }> = {
  open: {
    label: '申请开放',
    className: 'bg-green-100 text-green-800',
  },
  closed: {
    label: '已截止',
    className: 'bg-gray-100 text-gray-600',
  },
  pending: {
    label: '待定',
    className: 'bg-yellow-100 text-yellow-700',
  },
}

export default function StatusBadge({ status }: Props) {
  const { label, className } = statusConfig[status]

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  )
}
