'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewProgramPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '', school: '', country: 'US', degree: 'master' as const,
    field: '', status: 'pending' as const, deadline: '',
    languageReq: '', gpaReq: '', fee: '',
    applyUrl: '', description: '',
  })

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    alert('项目已创建（模拟）')
    router.push('/admin/programs')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/programs" className="text-gray-500 hover:text-gray-700 text-sm">← 返回</Link>
        <h1 className="text-2xl font-bold text-gray-900">新增项目</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">项目名 *</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">学校 *</label>
            <input required value={form.school} onChange={e => set('school', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">国家</label>
            <select value={form.country} onChange={e => set('country', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="bachelor">本科</option>
              <option value="master">硕士</option>
              <option value="phd">博士</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">专业方向</label>
            <input value={form.field} onChange={e => set('field', e.target.value)}
              placeholder="e.g. Computer Science"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">申请状态</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option value="open">申请开放</option>
              <option value="closed">已截止</option>
              <option value="pending">待定</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">截止日期</label>
            <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">申请链接 *</label>
            <input required type="url" value={form.applyUrl} onChange={e => set('applyUrl', e.target.value)}
              placeholder="https://"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">语言要求</label>
            <input value={form.languageReq} onChange={e => set('languageReq', e.target.value)}
              placeholder="e.g. TOEFL 100 / IELTS 7.0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPA 要求</label>
            <input type="number" step="0.1" min="0" max="4" value={form.gpaReq} onChange={e => set('gpaReq', e.target.value)}
              placeholder="e.g. 3.5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">申请费 (USD)</label>
            <input type="number" value={form.fee} onChange={e => set('fee', e.target.value)}
              placeholder="e.g. 75"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">项目简介</label>
          <textarea rows={4} value={form.description} onChange={e => set('description', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
            {saving ? '保存中...' : '创建项目'}
          </button>
          <Link href="/admin/programs" className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg text-sm hover:bg-gray-50">
            取消
          </Link>
        </div>
      </form>
    </div>
  )
}
