import { mockPrograms } from '@/lib/mock-data'
import FilterBar from '@/components/FilterBar'
import ProgramCard from '@/components/ProgramCard'
import Pagination from '@/components/Pagination'

const PAGE_SIZE = 12

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  const country = typeof params.country === 'string' ? params.country : undefined
  const degree = typeof params.degree === 'string' ? params.degree : undefined
  const field = typeof params.field === 'string' ? params.field : undefined
  const status = typeof params.status === 'string' ? params.status : undefined
  const q = typeof params.q === 'string' ? params.q : undefined
  const page = typeof params.page === 'string' ? parseInt(params.page) : 1

  let filtered = mockPrograms
  if (country) filtered = filtered.filter(p => p.country === country)
  if (degree) filtered = filtered.filter(p => p.degree === degree)
  if (field) filtered = filtered.filter(p => p.field === field)
  if (status) filtered = filtered.filter(p => p.status === status)
  if (q) filtered = filtered.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.school.toLowerCase().includes(q.toLowerCase())
  )

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(Math.max(1, page), totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE

  const paginationParams: Record<string, string> = {}
  if (country) paginationParams.country = country
  if (degree) paginationParams.degree = degree
  if (field) paginationParams.field = field
  if (status) paginationParams.status = status
  if (q) paginationParams.q = q

  const openCount = mockPrograms.filter(p => p.status === 'open').length

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero */}
      <section className="border-b border-border px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left */}
        <div>
          <p className="text-[9px] tracking-[0.2em] text-text-muted mb-3">
            ARCHIVE_SERIES // NOTIFICATIONS
          </p>
          <h1 className="text-4xl font-black tracking-[-0.05em] leading-[1.05] mb-4">
            OPEN.<br />APPLICATION<br />ALERTS.
          </h1>
          <p className="font-sans text-[13px] text-text-secondary leading-relaxed max-w-sm mb-6">
            订阅目标项目，申请窗口开放时第一时间收到邮件通知。面向计划申请海外研究生的中国学生。
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/subscribe"
              className="bg-accent-blue text-white text-[10px] tracking-[0.12em] px-5 py-2.5 hover:bg-accent-blue-dark transition-colors"
            >
              INITIALIZE CONNECTION →
            </a>
            <a
              href="#programs"
              className="border border-bg-inverse text-[10px] tracking-[0.12em] px-5 py-2.5 hover:bg-bg-secondary transition-colors"
            >
              VIEW PROGRAMS
            </a>
          </div>
        </div>

        {/* Right: Stats grid */}
        <div className="grid grid-cols-2 gap-px bg-border border border-border self-start">
          {[
            { label: 'PROGRAMS', value: String(mockPrograms.length), color: '' },
            { label: 'OPEN_NOW', value: String(openCount), color: 'text-accent-green' },
            { label: 'SUBSCRIBERS', value: '1.2K', color: 'text-accent-blue' },
            { label: 'LATENCY', value: '≤1HR', color: '' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-bg-primary p-5">
              <p className="text-[9px] tracking-[0.2em] text-text-muted mb-2">{label}</p>
              <p className={`text-3xl font-black tracking-tight ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Bar */}
      <FilterBar initialFilters={{ country, degree, field, status, q }} />

      {/* Programs */}
      <div id="programs" className="px-6 py-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] tracking-[0.15em] text-text-muted">
            PROGRAMS // {total} TOTAL · SHOWING {startIndex + 1}–{Math.min(startIndex + PAGE_SIZE, total)}
          </span>
          <span className="text-[10px] tracking-[0.15em] text-text-muted">
            SORT: DEADLINE_ASC
          </span>
        </div>

        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {paginated.map((program, i) => (
              <ProgramCard key={program.id} program={program} index={startIndex + i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-border bg-bg-secondary">
            <p className="text-[12px] tracking-[0.1em] text-text-secondary">NO PROGRAMS FOUND</p>
            <p className="font-sans text-[12px] text-text-muted mt-1">请尝试调整筛选条件</p>
          </div>
        )}

        {/* Subscribe Banner */}
        <div className="mt-px grid grid-cols-1 lg:grid-cols-2 bg-bg-inverse border border-border border-t-0">
          <div className="p-6 border-b lg:border-b-0 lg:border-r border-[#333]">
            <p className="text-[9px] tracking-[0.2em] text-[#555] mb-3">
              REQ_ACCESS // NOTIFICATION_SERVICE
            </p>
            <h2 className="text-2xl font-black tracking-tight text-text-inverse mb-2">
              NEVER MISS<br />AN OPENING.
            </h2>
            <p className="font-sans text-[12px] text-[#888] leading-relaxed">
              设置偏好，申请窗口开放时自动推送邮件。1小时内通知，不错过任何机会。
            </p>
          </div>
          <div className="p-6 flex flex-col justify-center gap-3">
            <p className="text-[9px] tracking-[0.2em] text-[#555]">ENTER TERMINAL ID (EMAIL)</p>
            <div className="border-b border-[#444] pb-2">
              <input
                type="email"
                placeholder="your@email.com_"
                className="bg-transparent text-text-inverse text-[13px] placeholder-[#444] focus:outline-none w-full"
              />
            </div>
            <a
              href="/subscribe"
              className="bg-bg-primary text-bg-inverse text-[10px] tracking-[0.12em] px-5 py-2.5 hover:bg-bg-secondary transition-colors self-start"
            >
              INITIALIZE CONNECTION →
            </a>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              baseUrl="/"
              searchParams={paginationParams}
            />
          </div>
        )}

        <p className="text-center text-[10px] tracking-[0.1em] text-text-muted mt-5 pb-4">
          OPENDAY // SYS_REF · PROGRAM DATABASE · {mockPrograms.length} ENTRIES · QS_TOP200
        </p>
      </div>
    </div>
  )
}
