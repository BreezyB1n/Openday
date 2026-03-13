// app/my/ProfileSidebar.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { UserProfile, Internship, Paper } from '@/lib/types'
import InternshipCard from './InternshipCard'
import PaperCard from './PaperCard'
import EditInternshipModal from './EditInternshipModal'
import EditPaperModal from './EditPaperModal'

const SectionLabel = ({ children }: { children: string }) => (
  <p className="text-[8px] tracking-[0.3em] text-text-muted mb-2">{children}</p>
)

const DataCell = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-bg-secondary p-2">
    <div className="text-[7px] tracking-[0.2em] text-text-muted mb-0.5">{label}</div>
    <div className="text-[11px]">{value || '—'}</div>
  </div>
)

const Divider = () => <hr className="border-border my-4" />

export default function ProfileSidebar({
  profile,
  onProfileChange,
}: {
  profile: UserProfile
  onProfileChange: (p: UserProfile) => void
}) {
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null)
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null)

  const initials = profile.email.slice(0, 2).toUpperCase()

  function saveInternship(updated: Internship) {
    onProfileChange({
      ...profile,
      internships: profile.internships.map(i => i.id === updated.id ? updated : i),
    })
  }

  function deleteInternship(id: string) {
    onProfileChange({ ...profile, internships: profile.internships.filter(i => i.id !== id) })
  }

  function addInternship() {
    const blank: Internship = {
      id: Date.now().toString(),
      company: '', role: '', department: '',
      startDate: '', endDate: '', description: '', tags: [],
    }
    onProfileChange({ ...profile, internships: [...profile.internships, blank] })
    setEditingInternship(blank)
  }

  function savePaper(updated: Paper) {
    onProfileChange({
      ...profile,
      papers: profile.papers.map(p => p.id === updated.id ? updated : p),
    })
  }

  function deletePaper(id: string) {
    onProfileChange({ ...profile, papers: profile.papers.filter(p => p.id !== id) })
  }

  function addPaper() {
    const blank: Paper = {
      id: Date.now().toString(),
      title: '', authorOrder: '', venue: '',
      year: new Date().getFullYear(), tags: [],
    }
    onProfileChange({ ...profile, papers: [...profile.papers, blank] })
    setEditingPaper(blank)
  }

  return (
    <>
      <div className="flex flex-col">
        {/* ── Identity bar ── */}
        <div className="bg-bg-inverse text-text-inverse px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 border border-[#555] flex items-center justify-center text-[12px] tracking-[0.05em] shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] tracking-[0.03em] truncate">{profile.email}</div>
            <div className="text-[8px] tracking-[0.2em] text-[#999] mt-0.5">MY_PAGE</div>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-0">

          {/* ── Academic background ── */}
          <div>
            <SectionLabel>ACADEMIC_BACKGROUND //</SectionLabel>
            <div className="grid grid-cols-2 gap-px mb-px">
              <DataCell label="CURRENT DEGREE" value={profile.currentDegree} />
              <DataCell label="SCHOOL" value={profile.school} />
              <DataCell label="MAJOR" value={profile.major} />
              <DataCell label="TARGET YEAR" value={profile.targetYear} />
            </div>
            <div className="grid grid-cols-2 gap-px mb-3">
              <DataCell label="GPA" value={profile.gpa} />
              <DataCell label="RANK" value={profile.rank || ''} />
              <DataCell label="IELTS / TOEFL" value={
                [profile.ielts && `IELTS ${profile.ielts}`, profile.toefl && `TOEFL ${profile.toefl}`]
                  .filter(Boolean).join(' / ') || ''
              } />
              <DataCell label="GRE / GMAT" value={
                [profile.gre && `GRE ${profile.gre}`, profile.gmat && `GMAT ${profile.gmat}`]
                  .filter(Boolean).join(' / ') || ''
              } />
            </div>
            <button
              className="border border-border text-[9px] tracking-[0.15em] px-3 py-1.5 hover:bg-bg-secondary transition-colors"
              onClick={() => {
                const gpa = window.prompt('GPA (e.g. 3.8)', profile.gpa)
                if (gpa === null) return
                onProfileChange({ ...profile, gpa })
              }}
            >
              编辑
            </button>
          </div>

          <Divider />

          {/* ── Internship ── */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <SectionLabel>INTERNSHIP //</SectionLabel>
              <button
                className="border border-border text-[8px] tracking-[0.1em] px-2 py-1 hover:bg-bg-secondary transition-colors"
                onClick={addInternship}
              >
                + 添加
              </button>
            </div>
            {profile.internships.length === 0 ? (
              <div className="border border-dashed border-border p-3 text-center text-[9px] text-text-muted tracking-[0.1em]">
                暂无实习经历 — 点击添加
              </div>
            ) : (
              profile.internships.map(item => (
                <InternshipCard key={item.id} item={item} onClick={() => setEditingInternship(item)} />
              ))
            )}
          </div>

          <Divider />

          {/* ── Papers ── */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <SectionLabel>RESEARCH & PAPERS //</SectionLabel>
              <button
                className="border border-border text-[8px] tracking-[0.1em] px-2 py-1 hover:bg-bg-secondary transition-colors"
                onClick={addPaper}
              >
                + 添加
              </button>
            </div>
            {profile.papers.length === 0 ? (
              <div className="border border-dashed border-border p-3 text-center text-[9px] text-text-muted tracking-[0.1em]">
                暂无论文记录 — 点击添加
              </div>
            ) : (
              profile.papers.map(item => (
                <PaperCard key={item.id} item={item} onClick={() => setEditingPaper(item)} />
              ))
            )}
          </div>

          <Divider />

          {/* ── Subscription prefs ── */}
          <div>
            <SectionLabel>SUBSCRIPTION_PREFS //</SectionLabel>
            <div className="text-[10px] text-text-secondary font-sans mb-3">
              订阅偏好在订阅页面管理。
            </div>
            <div className="flex gap-2">
              <Link
                href="/subscribe"
                className="bg-bg-inverse text-text-inverse text-[9px] tracking-[0.15em] px-3 py-1.5 hover:opacity-80 transition-opacity"
              >
                修改偏好
              </Link>
              <Link
                href="/unsubscribe"
                className="border border-border text-[9px] tracking-[0.15em] px-3 py-1.5 text-text-muted hover:bg-bg-secondary transition-colors"
              >
                退订
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      {editingInternship && (
        <EditInternshipModal
          item={editingInternship}
          onSave={saveInternship}
          onDelete={deleteInternship}
          onClose={() => setEditingInternship(null)}
        />
      )}
      {editingPaper && (
        <EditPaperModal
          item={editingPaper}
          onSave={savePaper}
          onDelete={deletePaper}
          onClose={() => setEditingPaper(null)}
        />
      )}
    </>
  )
}
