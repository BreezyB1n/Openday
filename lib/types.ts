export type Degree = 'bachelor' | 'master' | 'phd'
export type ProgramStatus = 'open' | 'closed' | 'pending'

export type Program = {
  id: string
  name: string
  school: string
  country: string           // e.g. "US", "UK", "AU", "CA", "SG"
  degree: Degree
  field: string             // e.g. "Computer Science", "Business", "Engineering"
  status: ProgramStatus
  deadline: string | null   // ISO date string "2025-12-01" or null
  languageReq: string | null  // e.g. "IELTS 6.5 / TOEFL 90"
  gpaReq: number | null       // e.g. 3.0
  fee: number | null          // USD
  applyUrl: string
  description: string | null
  updatedAt: string           // ISO datetime
}

export type Subscription = {
  id: string
  email: string
  degrees: Degree[]
  fields: string[]
  countries: string[]
  verified: boolean
  createdAt: string
}

export type AdminStats = {
  totalPrograms: number
  openPrograms: number
  totalSubscribers: number
  verifiedSubscribers: number
  todayNotifications: number
  monthNotifications: number
}

// For filter state on homepage
export type ProgramFilters = {
  country?: string
  degree?: string
  field?: string
  status?: string
  q?: string
  page?: number
}

// ── My Page types ──────────────────────────────────────

export type Internship = {
  id: string
  company: string
  role: string
  department?: string
  startDate: string   // "YYYY.MM"
  endDate: string     // "YYYY.MM"
  description: string
  tags: string[]
}

export type Paper = {
  id: string
  title: string
  authorOrder: string // e.g. "第一作者"
  venue: string       // e.g. "ACL 2024"
  year: number
  tags: string[]
}

export type UserProfile = {
  email: string
  currentDegree: string
  school: string
  major: string
  targetYear: string  // e.g. "2026 Fall"
  gpa: string         // bare numeric string e.g. "3.8"
  rank?: string
  ielts?: string      // bare numeric string e.g. "7.0"
  toefl?: string
  gre?: string
  gmat?: string
  internships: Internship[]
  papers: Paper[]
}

export type MaterialItem = {
  name: string
  done: boolean
}

export type ApplicationStatus = 'planning' | 'preparing' | 'submitted' | 'result'
export type ApplicationResult = 'offer' | 'declined' | 'waitlist'

export type ApplicationRecord = {
  id: string
  programId: string
  email: string
  status: ApplicationStatus
  // result is only meaningful when status === 'result'; undefined otherwise
  result?: ApplicationResult
  submittedAt?: string  // ISO date, only when status is 'submitted' or 'result'
  resultAt?: string     // ISO date, only when status === 'result' and result is known
  materials: MaterialItem[]
  notes?: string
}
