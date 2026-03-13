// app/my/ApplicationKanban.tsx
// Right panel: four kanban columns + stats bar at bottom.
// Loads related programs from mock-data for card display.
'use client'

import { useMemo } from 'react'
import type { ApplicationRecord, ApplicationStatus, UserProfile } from '@/lib/types'
import { mockPrograms } from '@/lib/mock-data'
import { upsertRecord, deleteRecord } from '@/lib/storage'
import KanbanCard from './KanbanCard'

const COLUMNS: { status: ApplicationStatus; label: string }[] = [
  { status: 'planning',  label: 'PLANNING'  },
  { status: 'preparing', label: 'PREPARING' },
  { status: 'submitted', label: 'SUBMITTED' },
  { status: 'result',    label: 'RESULT'    },
]

type Props = {
  records: ApplicationRecord[]
  email: string
  profile: UserProfile
  onRecordsChange: (records: ApplicationRecord[]) => void
}

export default function ApplicationKanban({ records, email, profile, onRecordsChange }: Props) {
  const programMap = useMemo(
    () => Object.fromEntries(mockPrograms.map(p => [p.id, p])),
    []
  )

  const byStatus = (status: ApplicationStatus) =>
    records.filter(r => r.status === status)

  const total       = records.length
  const inProgress  = records.filter(r => r.status === 'planning' || r.status === 'preparing').length
  const submitted   = records.filter(r => r.status === 'submitted').length
  const offers      = records.filter(r => r.result === 'offer').length

  function handleUpdate(updated: ApplicationRecord) {
    onRecordsChange(upsertRecord(email, updated))
  }

  function handleDelete(id: string) {
    onRecordsChange(deleteRecord(email, id))
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 pt-4 pb-3 border-b border-border">
          <p className="text-[8px] tracking-[0.3em] text-text-muted">APPLICATION_KANBAN // 0 PROGRAMS</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <p className="text-[9px] tracking-[0.15em] text-text-muted mb-2">暂无记录</p>
            <p className="text-[11px] font-sans text-text-secondary">从项目详情页添加到看板</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border flex justify-between items-center shrink-0">
        <p className="text-[8px] tracking-[0.3em] text-text-muted">
          APPLICATION_KANBAN // {total} PROGRAMS
        </p>
        {/* + 添加项目: opens a program-picker modal — out of scope for this sprint, wired in a follow-up */}
        <button className="bg-bg-inverse text-text-inverse text-[9px] tracking-[0.15em] px-3 py-1.5 hover:opacity-80 transition-opacity" disabled title="即将上线">
          + 添加项目
        </button>
      </div>

      {/* Kanban columns */}
      <div className="flex gap-px bg-border flex-1 overflow-hidden">
        {COLUMNS.map(col => {
          const colRecords = byStatus(col.status)
          return (
            <div key={col.status} className="flex-1 bg-bg-secondary flex flex-col overflow-hidden">
              {/* Column header */}
              <div className="px-2 py-2 flex justify-between items-center shrink-0 border-b border-border bg-bg-secondary">
                <span className="text-[8px] tracking-[0.2em] text-text-muted">{col.label}</span>
                <span className="bg-bg-inverse text-text-inverse text-[8px] tracking-[0.05em] px-1.5 py-0.5">
                  {colRecords.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-1.5">
                {colRecords.map(record => {
                  const program = programMap[record.programId]
                  if (!program) return null
                  return (
                    <KanbanCard
                      key={record.id}
                      record={record}
                      program={program}
                      profile={profile}
                      onUpdate={handleUpdate}
                      onDelete={handleDelete}
                    />
                  )
                })}
                {/* Add button */}
                <button className="w-full border border-dashed border-border text-[9px] tracking-[0.1em] text-text-muted py-2 hover:bg-bg-primary transition-colors">
                  + 添加
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-px bg-border shrink-0 border-t border-border">
        {[
          { label: 'TOTAL',       value: total,      color: '' },
          { label: 'IN PROGRESS', value: inProgress, color: '' },
          { label: 'SUBMITTED',   value: submitted,  color: '' },
          { label: 'OFFERS',      value: offers,     color: offers > 0 ? 'text-accent-green' : '' },
        ].map(s => (
          <div key={s.label} className="bg-bg-secondary text-center py-2">
            <div className="text-[7px] tracking-[0.2em] text-text-muted mb-0.5">{s.label}</div>
            <div className={`text-lg tracking-wider ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
