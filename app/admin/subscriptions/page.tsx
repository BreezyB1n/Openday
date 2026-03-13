// app/admin/subscriptions/page.tsx
import Link from 'next/link'
import { mockSubscriptions } from '@/lib/mock-data'

const degreeLabels: Record<string, string> = { bachelor: '本科', master: '硕士', phd: '博士' }
const countryFlags: Record<string, string> = { US: '🇺🇸', UK: '🇬🇧', AU: '🇦🇺', CA: '🇨🇦', SG: '🇸🇬' }

export default async function AdminSubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string }>
}) {
  const params = await searchParams

  let filtered = mockSubscriptions
  if (params.verified === 'true') filtered = filtered.filter(s => s.verified)
  if (params.verified === 'false') filtered = filtered.filter(s => !s.verified)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">订阅者管理</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        <Link
          href="/admin/subscriptions"
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            !params.verified
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          全部
        </Link>
        <Link
          href="/admin/subscriptions?verified=true"
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            params.verified === 'true'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          ✅ 已验证
        </Link>
        <Link
          href="/admin/subscriptions?verified=false"
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            params.verified === 'false'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          ⏳ 未验证
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600">邮箱</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">学位偏好</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">专业偏好</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">国家偏好</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">验证状态</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">订阅时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(sub => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{sub.email}</td>
                <td className="px-4 py-3 text-gray-600">
                  {sub.degrees.map(d => degreeLabels[d] || d).join('、')}
                </td>
                <td className="px-4 py-3 text-gray-600 max-w-xs">
                  <span className="truncate block">{sub.fields.join('、')}</span>
                </td>
                <td className="px-4 py-3">
                  {sub.countries.map(c => (
                    <span key={c} className="mr-1">{countryFlags[c] || c}</span>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {sub.verified ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                      ✅ 已验证
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
                      ⏳ 未验证
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {new Date(sub.createdAt).toLocaleDateString('zh-CN')}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  暂无订阅者
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-3">共 {filtered.length} 位订阅者</p>
    </div>
  )
}
