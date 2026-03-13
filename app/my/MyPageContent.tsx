// app/my/MyPageContent.tsx
// Client component — loads profile and kanban from localStorage,
// composes the two-column layout: sidebar (left) + kanban (right).
'use client'

import { useState, useEffect } from 'react'
import type { UserProfile, ApplicationRecord } from '@/lib/types'
import { loadProfile, saveProfile, createEmptyProfile, loadKanban, saveKanban } from '@/lib/storage'
import ProfileSidebar from './ProfileSidebar'
import ApplicationKanban from './ApplicationKanban'

export default function MyPageContent({ email }: { email: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [records, setRecords] = useState<ApplicationRecord[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const p = loadProfile(email) ?? createEmptyProfile(email)
    setProfile(p)
    setRecords(loadKanban(email))
    setMounted(true)
  }, [email])

  function handleProfileChange(updated: UserProfile) {
    setProfile(updated)
    saveProfile(updated)
  }

  function handleRecordsChange(updated: ApplicationRecord[]) {
    setRecords(updated)
    saveKanban(email, updated)
  }

  if (!mounted || !profile) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[11px] tracking-[0.1em] text-text-muted">LOADING...</p>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar — fixed width, independent scroll */}
      <div className="w-80 shrink-0 border-r border-border overflow-y-auto">
        <ProfileSidebar
          profile={profile}
          onProfileChange={handleProfileChange}
        />
      </div>

      {/* Right kanban — fills remaining width, independent scroll */}
      <div className="flex-1 overflow-y-auto">
        <ApplicationKanban
          records={records}
          email={email}
          profile={profile}
          onRecordsChange={handleRecordsChange}
        />
      </div>
    </div>
  )
}
