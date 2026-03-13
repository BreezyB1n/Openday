import Link from 'next/link'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-gray-900">管理后台</h2>
          <p className="text-xs text-gray-400 mt-0.5">Openday Admin</p>
        </div>
        <nav className="p-3 space-y-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span>📊</span>
            <span>数据概览</span>
          </Link>
          <Link
            href="/admin/programs"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span>📋</span>
            <span>项目管理</span>
          </Link>
          <Link
            href="/admin/subscriptions"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <span>📧</span>
            <span>订阅者管理</span>
          </Link>
          <hr className="my-2 border-gray-200" />
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <span>←</span>
            <span>返回前台</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  )
}
