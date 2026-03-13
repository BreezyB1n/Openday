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

const countryOptions = [
  { value: '', label: '全部国家' },
  { value: 'US', label: '🇺🇸 美国' },
  { value: 'UK', label: '🇬🇧 英国' },
  { value: 'AU', label: '🇦🇺 澳大利亚' },
  { value: 'CA', label: '🇨🇦 加拿大' },
  { value: 'SG', label: '🇸🇬 新加坡' },
]

const degreeOptions = [
  { value: '', label: '全部学位' },
  { value: 'bachelor', label: '本科' },
  { value: 'master', label: '硕士' },
  { value: 'phd', label: '博士' },
]

const fieldOptions = [
  { value: '', label: '全部专业' },
  { value: 'Computer Science', label: '计算机科学' },
  { value: 'Business', label: '商科' },
  { value: 'Engineering', label: '工程' },
  { value: 'Data Science', label: '数据科学' },
  { value: 'Public Policy', label: '公共政策' },
  { value: 'Medicine', label: '医学' },
]

const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 'open', label: '申请开放' },
  { value: 'closed', label: '已截止' },
  { value: 'pending', label: '待定' },
]

function FilterBarInner({ initialFilters }: Props) {
  const router = useRouter()
  useSearchParams() // read searchParams to opt into dynamic rendering

  const [q, setQ] = useState(initialFilters?.q ?? '')
  const [country, setCountry] = useState(initialFilters?.country ?? '')
  const [degree, setDegree] = useState(initialFilters?.degree ?? '')
  const [field, setField] = useState(initialFilters?.field ?? '')
  const [status, setStatus] = useState(initialFilters?.status ?? '')

  function buildUrl(overrides: Partial<Record<string, string>>) {
    const params = new URLSearchParams()
    const values: Record<string, string> = {
      q,
      country,
      degree,
      field,
      status,
      ...overrides,
    }
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

  function handleCountry(value: string) {
    setCountry(value)
    router.push(buildUrl({ country: value }))
  }

  function handleDegree(value: string) {
    setDegree(value)
    router.push(buildUrl({ degree: value }))
  }

  function handleField(value: string) {
    setField(value)
    router.push(buildUrl({ field: value }))
  }

  function handleStatus(value: string) {
    setStatus(value)
    router.push(buildUrl({ status: value }))
  }

  function handleReset() {
    setQ('')
    setCountry('')
    setDegree('')
    setField('')
    setStatus('')
    router.push('/')
  }

  const selectClass =
    'border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer'

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm select-none">
          🔍
        </span>
        <input
          type="text"
          value={q}
          onChange={(e) => handleQ(e.target.value)}
          placeholder="搜索学校或项目名..."
          className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Filter selects */}
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={country}
          onChange={(e) => handleCountry(e.target.value)}
          className={selectClass}
        >
          {countryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={degree}
          onChange={(e) => handleDegree(e.target.value)}
          className={selectClass}
        >
          {degreeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={field}
          onChange={(e) => handleField(e.target.value)}
          className={selectClass}
        >
          {fieldOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => handleStatus(e.target.value)}
          className={selectClass}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleReset}
          className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          重置筛选
        </button>
      </div>
    </div>
  )
}

export default function FilterBar(props: Props) {
  return (
    <Suspense fallback={<div className="h-20 animate-pulse bg-gray-100 rounded-xl" />}>
      <FilterBarInner {...props} />
    </Suspense>
  )
}
