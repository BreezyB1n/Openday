// lib/storage.ts
// localStorage helpers for My Page data.
// All reads return null when localStorage is unavailable (SSR).

import type { UserProfile, ApplicationRecord } from './types'

const PROFILE_KEY = (email: string) => `openday_profile_${email}`
const KANBAN_KEY  = (email: string) => `openday_kanban_${email}`

// ── Profile ────────────────────────────────────────────

export function loadProfile(email: string): UserProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROFILE_KEY(email))
    return raw ? (JSON.parse(raw) as UserProfile) : null
  } catch {
    return null
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(PROFILE_KEY(profile.email), JSON.stringify(profile))
}

export function createEmptyProfile(email: string): UserProfile {
  return {
    email,
    currentDegree: '',
    school: '',
    major: '',
    targetYear: '',
    gpa: '',
    internships: [],
    papers: [],
  }
}

// ── Kanban ─────────────────────────────────────────────

export function loadKanban(email: string): ApplicationRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KANBAN_KEY(email))
    return raw ? (JSON.parse(raw) as ApplicationRecord[]) : []
  } catch {
    return []
  }
}

export function saveKanban(email: string, records: ApplicationRecord[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KANBAN_KEY(email), JSON.stringify(records))
}

export function upsertRecord(
  email: string,
  updated: ApplicationRecord
): ApplicationRecord[] {
  const records = loadKanban(email)
  const idx = records.findIndex(r => r.id === updated.id)
  const next = idx >= 0
    ? records.map(r => r.id === updated.id ? updated : r)
    : [...records, updated]
  saveKanban(email, next)
  return next
}

export function deleteRecord(email: string, id: string): ApplicationRecord[] {
  const next = loadKanban(email).filter(r => r.id !== id)
  saveKanban(email, next)
  return next
}
