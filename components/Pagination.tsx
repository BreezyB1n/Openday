import Link from 'next/link'

type Props = {
  page: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string>
}

function buildUrl(
  baseUrl: string,
  searchParams: Record<string, string> | undefined,
  targetPage: number
): string {
  const params = new URLSearchParams(searchParams)
  params.set('page', String(targetPage))
  return `${baseUrl}?${params.toString()}`
}

function getPageNumbers(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | '...')[] = []
  if (page <= 3) {
    pages.push(1, 2, 3, 4, 5)
    if (totalPages > 5) pages.push('...', totalPages)
  } else if (page >= totalPages - 2) {
    pages.push(1, '...')
    for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1, '...')
    pages.push(page - 1, page, page + 1)
    pages.push('...', totalPages)
  }
  return pages
}

export default function Pagination({ page, totalPages, baseUrl, searchParams }: Props) {
  if (totalPages <= 1) return null

  const pageNumbers = getPageNumbers(page, totalPages)
  const isPrevDisabled = page === 1
  const isNextDisabled = page === totalPages

  const baseBtn = 'px-3 py-2 text-[11px] border-r border-border font-mono transition-colors'
  const activeBtn = 'bg-bg-inverse text-text-inverse pointer-events-none'
  const inactiveBtn = 'bg-bg-primary text-text-secondary hover:bg-bg-secondary'
  const disabledBtn = 'bg-bg-primary text-text-muted cursor-not-allowed select-none'

  return (
    <nav
      className="flex items-center border border-border w-fit mx-auto"
      aria-label="分页导航"
    >
      {isPrevDisabled ? (
        <span className={`${baseBtn} ${disabledBtn}`}>← PREV</span>
      ) : (
        <Link href={buildUrl(baseUrl, searchParams, page - 1)} className={`${baseBtn} ${inactiveBtn}`}>
          ← PREV
        </Link>
      )}

      {pageNumbers.map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className={`${baseBtn} ${disabledBtn}`}>
            ···
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(baseUrl, searchParams, p)}
            className={`${baseBtn} ${p === page ? activeBtn : inactiveBtn}`}
            aria-current={p === page ? 'page' : undefined}
          >
            {String(p).padStart(2, '0')}
          </Link>
        )
      )}

      {isNextDisabled ? (
        <span className={`border-r-0 ${baseBtn} ${disabledBtn}`}>NEXT →</span>
      ) : (
        <Link
          href={buildUrl(baseUrl, searchParams, page + 1)}
          className={`border-r-0 ${baseBtn} ${inactiveBtn}`}
        >
          NEXT →
        </Link>
      )}
    </nav>
  )
}
