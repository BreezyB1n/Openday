// app/my/ProfileSidebar.tsx
// Left sidebar: user identity bar + academic background + internships +
// papers + subscription preferences.
'use client'

import Link from 'next/link'
import type { UserProfile } from '@/lib/types'
import InternshipCard from './InternshipCard'
import PaperCard from './PaperCard'

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
  const initials = profile.email.slice(0, 2).toUpperCase()

  return (
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
              // Inline edit: prompt for each field (MVP — full form UI is future work)
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
              onClick={() => {
                const company = window.prompt('公司名称')
                if (!company) return
                const role = window.prompt('职位') || ''
                const startDate = window.prompt('开始时间 (YYYY.MM)') || ''
                const endDate = window.prompt('结束时间 (YYYY.MM)') || ''
                const description = window.prompt('工作描述') || ''
                const tagsRaw = window.prompt('技能标签（逗号分隔）') || ''
                const newItem = {
                  id: Date.now().toString(),
                  company, role, startDate, endDate, description,
                  tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
                }
                onProfileChange({ ...profile, internships: [...profile.internships, newItem] })
              }}
            >
              + 添加
            </button>
          </div>
          {profile.internships.length === 0 ? (
            <div className="border border-dashed border-border p-3 text-center text-[9px] text-text-muted tracking-[0.1em]">
              暂无实习经历 — 点击添加
            </div>
          ) : (
            profile.internships.map(item => <InternshipCard key={item.id} item={item} />)
          )}
        </div>

        <Divider />

        {/* ── Papers ── */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <SectionLabel>RESEARCH & PAPERS //</SectionLabel>
            <button
              className="border border-border text-[8px] tracking-[0.1em] px-2 py-1 hover:bg-bg-secondary transition-colors"
              onClick={() => {
                const title = window.prompt('论文标题')
                if (!title) return
                const authorOrder = window.prompt('作者顺序（如：第一作者）') || ''
                const venue = window.prompt('期刊/会议（如：ACL 2024）') || ''
                const yearStr = window.prompt('发表年份') || ''
                const tagsRaw = window.prompt('研究方向标签（逗号分隔）') || ''
                const newItem = {
                  id: Date.now().toString(),
                  title, authorOrder, venue,
                  year: parseInt(yearStr) || new Date().getFullYear(),
                  tags: tagsRaw.split(',').map(t => t.trim()).filter(Boolean),
                }
                onProfileChange({ ...profile, papers: [...profile.papers, newItem] })
              }}
            >
              + 添加
            </button>
          </div>
          {profile.papers.length === 0 ? (
            <div className="border border-dashed border-border p-3 text-center text-[9px] text-text-muted tracking-[0.1em]">
              暂无论文记录 — 点击添加
            </div>
          ) : (
            profile.papers.map(item => <PaperCard key={item.id} item={item} />)
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
  )
}
