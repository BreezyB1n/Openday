'use client'

import { useState } from 'react'
import type { Internship } from '@/lib/types'

type Props = {
  item: Internship
  onSave: (updated: Internship) => void
  onDelete: (id: string) => void
  onClose: () => void
}

export default function EditInternshipModal({ item, onSave, onDelete, onClose }: Props) {
  const [form, setForm] = useState<Internship>({ ...item })

  function set(field: keyof Internship, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handleTagsChange(raw: string) {
    setForm(prev => ({ ...prev, tags: raw.split(',').map(t => t.trim()).filter(Boolean) }))
  }

  function handleSave() {
    onSave(form)
    onClose()
  }

  function handleDelete() {
    if (!window.confirm('删除这条实习经历？')) return
    onDelete(item.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="w-[420px] bg-bg-primary border-l border-border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-bg-inverse text-text-inverse px-5 py-3 flex justify-between items-center shrink-0">
          <div>
            <div className="text-[9px] tracking-[0.25em] text-[#999] mb-0.5">EDIT //</div>
            <div className="text-[13px] tracking-tight">INTERNSHIP</div>
          </div>
          <button onClick={onClose} className="text-[#999] hover:text-white text-lg leading-none">✕</button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

          <Field label="公司名称 *">
            <input value={form.company} onChange={e => set('company', e.target.value)}
              className="w-full bg-bg-secondary border border-border px-3 py-2 text-[12px] focus:outline-none focus:border-text-primary" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="职位 *">
              <input value={form.role} onChange={e => set('role', e.target.value)}
                className="w-full bg-bg-secondary border border-border px-3 py-2 text-[12px] focus:outline-none focus:border-text-primary" />
            </Field>
            <Field label="部门">
              <input value={form.department ?? ''} onChange={e => set('department', e.target.value)}
                className="w-full bg-bg-secondary border border-border px-3 py-2 text-[12px] focus:outline-none focus:border-text-primary" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="开始时间">
              <input value={form.startDate} onChange={e => set('startDate', e.target.value)}
                placeholder="YYYY.MM"
                className="w-full bg-bg-secondary border border-border px-3 py-2 text-[12px] focus:outline-none focus:border-text-primary" />
            </Field>
            <Field label="结束时间">
              <input value={form.endDate} onChange={e => set('endDate', e.target.value)}
                placeholder="YYYY.MM"
                className="w-full bg-bg-secondary border border-border px-3 py-2 text-[12px] focus:outline-none focus:border-text-primary" />
            </Field>
          </div>

          <Field label="工作描述">
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              rows={5}
              className="w-full bg-bg-secondary border border-border px-3 py-2 text-[12px] leading-relaxed resize-none focus:outline-none focus:border-text-primary" />
          </Field>

          <Field label="技能标签（逗号分隔）">
            <input value={form.tags.join(', ')} onChange={e => handleTagsChange(e.target.value)}
              placeholder="Golang, Redis, Docker"
              className="w-full bg-bg-secondary border border-border px-3 py-2 text-[12px] focus:outline-none focus:border-text-primary" />
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {form.tags.map(tag => (
                  <span key={tag} className="border border-border text-[8px] tracking-[0.05em] px-1.5 py-0.5 text-text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Field>

        </div>

        {/* Footer */}
        <div className="border-t border-border px-5 py-3 flex justify-between items-center shrink-0">
          <button onClick={handleDelete}
            className="text-[9px] tracking-[0.1em] text-text-muted border border-border px-3 py-1.5 hover:border-accent-orange hover:text-accent-orange transition-colors">
            删除
          </button>
          <div className="flex gap-2">
            <button onClick={onClose}
              className="text-[9px] tracking-[0.1em] border border-border px-4 py-1.5 hover:bg-bg-secondary transition-colors">
              取消
            </button>
            <button onClick={handleSave}
              className="text-[9px] tracking-[0.1em] bg-bg-inverse text-text-inverse px-4 py-1.5 hover:opacity-80 transition-opacity">
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[8px] tracking-[0.2em] text-text-muted mb-1.5">{label}</div>
      {children}
    </div>
  )
}
