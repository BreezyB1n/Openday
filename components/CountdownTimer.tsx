'use client'

import { useEffect, useState } from 'react'

type Props = {
  deadline: string | null
}

function calcDaysRemaining(deadline: string): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(deadline)
  target.setHours(0, 0, 0, 0)
  const diffMs = target.getTime() - today.getTime()
  return Math.round(diffMs / (1000 * 60 * 60 * 24))
}

export default function CountdownTimer({ deadline }: Props) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)

  useEffect(() => {
    if (!deadline) return
    setDaysRemaining(calcDaysRemaining(deadline))
  }, [deadline])

  if (!deadline) {
    return <span className="text-text-muted text-[10px] tracking-[0.05em]">DDL: TBD</span>
  }

  if (daysRemaining === null) return null

  if (daysRemaining < 0) {
    return <span className="text-text-secondary text-[10px] tracking-[0.05em]">已截止</span>
  }

  return (
    <span className="text-accent-orange text-[13px] font-bold tracking-tight">
      {daysRemaining} DAYS
    </span>
  )
}
