import Link from 'next/link'
import { mockPrograms } from '@/lib/mock-data'
import StatusBadge from '@/components/StatusBadge'
import AdminProgramActions from './AdminProgramActions'

export default async function AdminProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; country?: string; degree?: string }>
}) {
  const params = await searchParams

  let filtered = mockPrograms
  if (params.q) {
    const q = params.q.toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) || p.school.toLowerCase().includes(q)
    )
  }
  if (params.status) filtered = filtered.filter(p => p.status === params.status)
  if (params.country) filtered = filtered.filter(p => p.country === params.country)
  if (params.degree) filtered = filtered.filter(p => p.degree === params.degree)

  const degreeLabels: Record<string, string> = { bachelor: '本科', master: '硕士', phd: '博士' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">项目管理</h1>
        <Link
          href="/admin/programs/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          + 新增项目
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex gap-3 mb-6 flex-wrap">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="搜索学校或项目..."
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select name="status" defaultValue={params.status || ''} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
          <option value="">全部状态</option>
          <option value="open">申请开放</option>
          <option value="closed">已截止</option>
          <option value="unknown">待定</option>
        </select>
        <select name="country" defaultValue={params.country || ''} className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
          <option value="">全部国家</option>
          <option value="US">🇺🇸 美国</option>
          <option value="UK">🇬🇧 英国</option>
          <option value="AU">🇦🇺 澳大利亚</option>
          <option value="CA">🇨🇦 加拿大</option>
          <option value="SG">🇸🇬 新加坡</option>
        </select>
        <button type="submit" className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-200">
          筛选
        </button>
        <Link href="/admin/programs" className="text-gray-500 text-sm py-1.5 hover:text-gray-700">
          重置
        </Link>
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">学校</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">项目名</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">国家</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">学位</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">状态</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">截止日期</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(program => (
              <tr key={program.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{program.school}</td>
                <td className="px-4 py-3 text-gray-700 max-w-xs truncate">{program.name}</td>
                <td className="px-4 py-3">{program.country}</td>
                <td className="px-4 py-3">{degreeLabels[program.degree]}</td>
                <td className="px-4 py-3"><StatusBadge status={program.status} /></td>
                <td className="px-4 py-3 text-gray-500">{program.deadline || '—'}</td>
                <td className="px-4 py-3">
                  <AdminProgramActions programId={program.id} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  没有找到匹配的项目
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">共 {filtered.length} 个项目</p>
    </div>
  )
}
