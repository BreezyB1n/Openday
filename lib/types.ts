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
