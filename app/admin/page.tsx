import { mockStats } from '@/lib/mock-data'

export default function AdminDashboard() {
  const stats = mockStats

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">数据概览</h1>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard icon="📋" label="项目总数" value={stats.totalPrograms} />
        <StatCard icon="🟢" label="申请开放中" value={stats.openPrograms} color="text-green-600" />
        <StatCard icon="📧" label="订阅总数" value={stats.totalSubscribers} />
        <StatCard icon="✅" label="已验证订阅" value={stats.verifiedSubscribers} color="text-accent-blue" />
        <StatCard icon="📨" label="今日推送" value={stats.todayNotifications} />
        <StatCard icon="📅" label="本月推送" value={stats.monthNotifications} />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  color = 'text-text-primary',
}: {
  icon: string
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="bg-bg-primary border border-border p-5">
      <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <p className={`text-3xl font-bold ${color}`}>{value.toLocaleString()}</p>
    </div>
  )
}
