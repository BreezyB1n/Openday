'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { mockPrograms } from '@/lib/mock-data'
import { use } from 'react'

// Mock change log
const mockChangeLogs = [
  { id: 1, field: 'status', oldValue: 'unknown', newValue: 'open', changedAt: '2026-03-01T10:00:00Z', note: '申请开放' },
  { id: 2, field: 'deadline', oldValue: null, newValue: '2026-04-15', changedAt: '2026-03-01T10:00:00Z', note: '设置截止日期' },
]

export default function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const program = mockPrograms.find(p => p.id === id)

  const [saving, setSaving] = useState(false)
  const [notifying, setNotifying] = useState(false)
  const [notifyResult, setNotifyResult] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: program?.name || '',
    school: program?.school || '',
    country: program?.country || 'US',
    degree: program?.degree || 'master',
    field: program?.field || '',
    status: program?.status || 'pending',
    deadline: program?.deadline || '',
    languageReq: program?.languageReq || '',
    gpaReq: program?.gpaReq?.toString() || '',
    fee: program?.fee?.toString() || '',
    applyUrl: program?.applyUrl || '',
    description: program?.description || '',
  })

  if (!program) {
    return (
      <div className="text-center py-12">
        <p className="text-text-secondary">项目不存在</p>
        <Link href="/admin/programs" className="text-accent-blue hover:underline text-sm mt-2 inline-block">
          返回项目列表
        </Link>
      </div>
    )
  }

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    alert('保存成功（模拟）')
  }

  async function handleNotify() {
    if (!confirm('确认推送通知给所有匹配订阅者？')) return
    setNotifying(true)
    setNotifyResult(null)
    await new Promise(r => setTimeout(r, 1200))
    setNotifying(false)
    setNotifyResult('推送完成：发送 42 封，跳过 8 封，失败 0 封。（模拟数据）')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/programs" className="text-text-secondary hover:text-gray-700 text-sm">← 返回</Link>
        <h1 className="text-2xl font-bold text-text-primary">编辑项目</h1>
      </div>

      <div className="flex gap-6">
        {/* Edit form */}
        <form onSubmit={handleSubmit} className="bg-bg-primary border border-border p-6 flex-1 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">项目名 *</label>
              <input required value={form.name} onChange={e => set('name', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">学校 *</label>
              <input required value={form.school} onChange={e => set('school', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">国家</label>
              <select value={form.country} onChange={e => set('country', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm">
                <option value="US">🇺🇸 美国</option>
                <option value="UK">🇬🇧 英国</option>
                <option value="AU">🇦🇺 澳大利亚</option>
                <option value="CA">🇨🇦 加拿大</option>
                <option value="SG">🇸🇬 新加坡</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">学位</label>
              <select value={form.degree} onChange={e => set('degree', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm">
                <option value="bachelor">本科</option>
                <option value="master">硕士</option>
                <option value="phd">博士</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">专业方向</label>
              <input value={form.field} onChange={e => set('field', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请状态</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm">
                <option value="open">申请开放</option>
                <option value="closed">已截止</option>
                <option value="pending">待定</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
              <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请链接 *</label>
              <input required type="url" value={form.applyUrl} onChange={e => set('applyUrl', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">语言要求</label>
              <input value={form.languageReq} onChange={e => set('languageReq', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA 要求</label>
              <input type="number" step="0.1" value={form.gpaReq} onChange={e => set('gpaReq', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">申请费 (USD)</label>
              <input type="number" value={form.fee} onChange={e => set('fee', e.target.value)}
                className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">项目简介</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)}
              className="w-full border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-accent-blue" />
          </div>

          {/* Notify button */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200">
            <h3 className="text-sm font-medium text-green-800 mb-2">推送通知</h3>
            <button
              type="button"
              onClick={handleNotify}
              disabled={notifying}
              className="bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {notifying ? '推送中...' : '触发推送通知'}
            </button>
            {notifyResult && (
              <p className="text-green-700 text-sm mt-2">{notifyResult}</p>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <button type="submit" disabled={saving}
              className="bg-accent-blue text-white px-6 py-2 text-sm hover:bg-accent-blue-dark disabled:opacity-50">
              {saving ? '保存中...' : '保存修改'}
            </button>
            <Link href="/admin/programs" className="border border-border text-gray-600 px-6 py-2 text-sm hover:bg-gray-50">
              取消
            </Link>
          </div>
        </form>

        {/* Change log */}
        <div className="w-72 flex-shrink-0">
          <div className="bg-bg-primary border border-border p-4">
            <h3 className="font-medium text-text-primary mb-3 text-sm">变更记录</h3>
            <div className="space-y-3">
              {mockChangeLogs.map(log => (
                <div key={log.id} className="text-xs border-l-2 border-border pl-3">
                  <p className="text-gray-700">{log.note}</p>
                  <p className="text-gray-400 mt-0.5">
                    {new Date(log.changedAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
