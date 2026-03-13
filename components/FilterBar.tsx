'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type Props = {
  initialFilters?: {
    country?: string
    degree?: string
    field?: string
    status?: string
    q?: string
  }
}

const countryChips = [
  { value: 'US', label: 'USA' },
  { value: 'UK', label: 'UK' },
  { value: 'AU', label: 'AU' },
  { value: 'CA', label: 'CA' },
  { value: 'SG', label: 'SG' },
  { value: 'DE', label: 'DE' },
]

const degreeChips = [
  { value: 'bachelor', label: 'BACHELOR' },
  { value: 'master', label: 'MASTER' },
  { value: 'phd', label: 'PHD' },
]

const fieldChips = [
  { value: 'Computer Science', label: 'CS' },
  { value: 'Business', label: 'BUSINESS' },
  { value: 'Engineering', label: 'ENG' },
  { value: 'Data Science', label: 'DS' },
  { value: 'Public Policy', label: 'POLICY' },
  { value: 'Medicine', label: 'MED' },
]

const statusChips = [
  { value: 'open', label: 'OPEN' },
  { value: 'closed', label: 'CLOSED' },
  { value: 'pending', label: 'PENDING' },
]

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 text-[10px] tracking-[0.08em] border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue ${
        active
          ? 'bg-bg-inverse text-text-inverse border-bg-inverse'
          : 'bg-bg-primary border-border text-text-secondary hover:bg-bg-secondary hover:border-text-secondary'
      }`}
    >
      {label}
    </button>
  )
}

function FilterBarInner({ initialFilters }: Props) {
  const router = useRouter()
  useSearchParams()

  const [q, setQ] = useState(initialFilters?.q ?? '')
  const [country, setCountry] = useState(initialFilters?.country ?? '')
  const [degree, setDegree] = useState(initialFilters?.degree ?? '')
  const [field, setField] = useState(initialFilters?.field ?? '')
  const [status, setStatus] = useState(initialFilters?.status ?? '')

  function buildUrl(overrides: Partial<Record<string, string>>) {
    const params = new URLSearchParams()
    const values: Record<string, string> = { q, country, degree, field, status, ...overrides }
    for (const [key, val] of Object.entries(values)) {
      if (val) params.set(key, val)
    }
    const qs = params.toString()
    return qs ? `/?${qs}` : '/'
  }

  function handleQ(value: string) {
    setQ(value)
    router.push(buildUrl({ q: value }))
  }

  function handleChip(key: string, value: string, current: string, setter: (v: string) => void) {
    const next = current === value ? '' : value
    setter(next)
    router.push(buildUrl({ [key]: next }))
  }

  function handleReset() {
    setQ('')
    setCountry('')
    setDegree('')
    setField('')
    setStatus('')
    router.push('/')
  }

  return (
    <div className="bg-bg-secondary border-b border-border px-6 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="text-[9px] tracking-[0.2em] text-text-muted shrink-0">FILTER //</span>

      {/* Country chips */}
      <div className="flex flex-wrap gap-1">
        {countryChips.map(c => (
          <Chip
            key={c.value}
            label={c.label}
            active={country === c.value}
            onClick={() => handleChip('country', c.value, country, setCountry)}
          />
        ))}
      </div>

      {/* Degree chips */}
      <div className="flex flex-wrap gap-1">
        {degreeChips.map(c => (
          <Chip
            key={c.value}
            label={c.label}
            active={degree === c.value}
            onClick={() => handleChip('degree', c.value, degree, setDegree)}
          />
        ))}
      </div>

      {/* Field chips */}
      <div className="flex flex-wrap gap-1">
        {fieldChips.map(c => (
          <Chip
            key={c.value}
            label={c.label}
            active={field === c.value}
            onClick={() => handleChip('field', c.value, field, setField)}
          />
        ))}
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-1">
        {statusChips.map(c => (
          <Chip
            key={c.value}
            label={c.label}
            active={status === c.value}
            onClick={() => handleChip('status', c.value, status, setStatus)}
          />
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        value={q}
        onChange={(e) => handleQ(e.target.value)}
        placeholder="SEARCH PROGRAMS_"
        className="ml-auto border border-border bg-white px-3 py-1.5 text-[11px] placeholder-text-muted focus:outline-none focus:border-accent-blue w-48"
      />

      {/* Reset */}
      {(q || country || degree || field || status) && (
        <button
          type="button"
          onClick={handleReset}
          className="text-[10px] tracking-[0.08em] text-text-secondary hover:text-text-primary transition-colors shrink-0"
        >
          RESET
        </button>
      )}
    </div>
  )
}

export default function FilterBar(props: Props) {
  return (
    <Suspense fallback={<div className="h-12 bg-bg-secondary border-b border-border animate-pulse" />}>
      <FilterBarInner {...props} />
    </Suspense>
  )
}
