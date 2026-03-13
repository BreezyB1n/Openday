import { notFound } from 'next/navigation'
import Link from 'next/link'
import { mockPrograms } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'
import CountdownTimer from '@/components/CountdownTimer'

const countryNames: Record<string, string> = {
  US: 'USA', UK: 'UK', AU: 'AU', CA: 'CA', SG: 'SG', DE: 'DE', HK: 'HK'
}

const degreeLabels: Record<string, string> = {
  bachelor: 'BACHELOR', master: 'MASTER', phd: 'PHD'
}

function formatDate(iso: string | null): string {
  if (!iso) return 'TBD'
  return iso.replace(/-/g, '.')
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const program = mockPrograms.find(p => p.id === id)
  if (!program) notFound()

  const index = mockPrograms.findIndex(p => p.id === id)
  const refNum = String(index + 1).padStart(3, '0')

  // Related programs: same field, different program
  const related = mockPrograms
    .filter(p => p.id !== program.id && p.field === program.field)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Breadcrumb */}
      <div className="px-6 py-2.5 border-b border-border text-[10px] tracking-[0.1em] text-text-muted">
        <Link href="/" className="text-accent-blue hover:underline">PROGRAMS</Link>
        {' // '}
        {countryNames[program.country] ?? program.country}
        {' // '}
        {program.school.toUpperCase()}
        {' // '}
        <span className="text-text-primary">{program.field.toUpperCase().replace(/ /g, '_')}</span>
      </div>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row">
        {/* Left main content */}
        <div className="flex-1 border-r border-border">

          {/* Title block */}
          <div className="p-6 border-b border-border">
            <p className="text-[9px] tracking-[0.2em] text-text-muted mb-2">
              REF_{refNum} // {countryNames[program.country] ?? program.country}
            </p>
            <h1 className="text-3xl font-black tracking-[-0.03em] mb-1">
              {program.school.toUpperCase()}
            </h1>
            <p className="font-sans text-lg font-semibold text-text-secondary mb-4 leading-snug">
              {program.name} · {degreeLabels[program.degree] ?? program.degree}
            </p>
            <div className="flex gap-2 flex-wrap">
              <StatusBadge status={program.status} />
              <span className="text-[9px] tracking-[0.08em] px-1.5 py-0.5 border border-border-light text-text-muted">
                {degreeLabels[program.degree]}
              </span>
              <span className="text-[9px] tracking-[0.08em] px-1.5 py-0.5 border border-border-light text-text-muted">
                {countryNames[program.country]}
              </span>
            </div>
          </div>

          {/* Key data — 3-cell grid */}
          <div className="grid grid-cols-3 gap-px bg-border border-b border-border">
            {[
              { label: 'DEADLINE', value: formatDate(program.deadline), accent: program.status === 'open' },
              { label: 'STATUS', value: program.status.toUpperCase(), accent: program.status === 'open' },
              { label: 'UPDATED', value: formatDate(program.updatedAt.split('T')[0]), accent: false },
            ].map(({ label, value, accent }) => (
              <div key={label} className="bg-bg-primary p-4">
                <p className="text-[9px] tracking-[0.2em] text-text-muted mb-1">{label}</p>
                <p className={`font-bold text-sm tracking-tight ${accent ? 'text-accent-orange' : ''}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Countdown highlight */}
          <div className="bg-bg-secondary border-b border-border p-5 flex items-center gap-6">
            <div>
              <p className="text-[9px] tracking-[0.2em] text-text-muted mb-1">TIME_REMAINING //</p>
              <CountdownTimer deadline={program.deadline} />
            </div>
            <div className="w-px h-14 bg-border" />
            <div className="font-sans text-[12px] text-text-secondary leading-relaxed">
              {program.deadline ? (
                <>截止时间: {formatDate(program.deadline)}<br />申请系统: 官方申请门户</>
              ) : (
                '截止日期待确认，请关注官网'
              )}
            </div>
          </div>

          {/* Requirements table */}
          <div className="p-6 border-b border-border">
            <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">ADMISSION_REQUIREMENTS //</p>
            <table className="w-full">
              <tbody>
                {[
                  { key: 'LANGUAGE_REQ', value: program.languageReq ?? '暂无要求' },
                  { key: 'GPA_MIN', value: program.gpaReq ? `${program.gpaReq} / 4.0` : '暂无要求' },
                  { key: 'APPLICATION_FEE', value: program.fee ? `$${program.fee}` : '免费' },
                  { key: 'DEGREE', value: degreeLabels[program.degree] ?? program.degree },
                  { key: 'FIELD', value: program.field },
                  { key: 'COUNTRY', value: countryNames[program.country] ?? program.country },
                ].map(({ key, value }) => (
                  <tr key={key} className="border-b border-border-light last:border-0">
                    <td className="py-2.5 pr-4 text-[10px] tracking-[0.1em] text-text-muted w-36">
                      {key}
                    </td>
                    <td className="py-2.5 font-sans text-[13px] text-text-primary">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Description */}
          {program.description && (
            <div className="p-6">
              <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">PROGRAM_OVERVIEW //</p>
              <p className="font-sans text-[13px] text-text-secondary leading-relaxed">
                {program.description}
              </p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:w-72">
          {/* Apply CTA */}
          <div className="p-5 border-b border-border">
            <p className="text-[9px] tracking-[0.2em] text-text-muted mb-2">APPLICATION_PORTAL //</p>
            <p className="text-xl font-black tracking-tight mb-1">{formatDate(program.deadline)}</p>
            <div className="mb-5">
              <CountdownTimer deadline={program.deadline} />
            </div>
            <a
              href={program.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-accent-blue text-white text-center text-[10px] tracking-[0.12em] py-3 hover:bg-accent-blue-dark transition-colors mb-2"
            >
              APPLY NOW →
            </a>
            <Link
              href="/subscribe"
              className="block w-full border border-bg-inverse text-center text-[10px] tracking-[0.12em] py-3 hover:bg-bg-secondary transition-colors"
            >
              SUBSCRIBE ALERTS
            </Link>
          </div>

          {/* System status panel */}
          <div className="bg-bg-inverse border-b border-border">
            {[
              { key: 'PORTAL', value: 'ONLINE', color: 'text-accent-green' },
              { key: 'STATUS', value: program.status.toUpperCase(), color: program.status === 'open' ? 'text-accent-green' : 'text-text-muted' },
              { key: 'URGENCY', value: program.status === 'open' ? 'HIGH' : 'LOW', color: program.status === 'open' ? 'text-accent-orange' : 'text-text-muted' },
              { key: 'UPDATED', value: formatDate(program.updatedAt.split('T')[0]), color: 'text-[#888]' },
            ].map(({ key, value, color }) => (
              <div key={key} className="flex justify-between items-center px-5 py-2.5 border-b border-[#222] last:border-0">
                <span className="text-[10px] tracking-[0.1em] text-[#555]">{key}</span>
                <span className={`text-[10px] tracking-[0.1em] ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Related programs */}
          {related.length > 0 && (
            <div>
              <div className="px-5 py-3 border-b border-border">
                <p className="text-[9px] tracking-[0.2em] text-text-muted">RELATED_PROGRAMS //</p>
              </div>
              {related.map(r => (
                <Link
                  key={r.id}
                  href={`/programs/${r.id}`}
                  className="block px-5 py-3.5 border-b border-border hover:bg-bg-secondary transition-colors"
                >
                  <p className="text-[11px] font-bold mb-0.5">{r.school.toUpperCase()}</p>
                  <p className="font-sans text-[11px] text-text-secondary truncate">{r.name}</p>
                  <StatusBadge status={r.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
