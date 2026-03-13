'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function AdminProgramActions({ programId }: { programId: string }) {
  const [pushing, setPushing] = useState(false)

  async function handlePush() {
    if (!confirm('确认推送通知给匹配订阅者？')) return
    setPushing(true)
    await new Promise(r => setTimeout(r, 800))
    setPushing(false)
    alert('推送成功！（模拟）')
  }

  function handleDelete() {
    if (!confirm('确认删除此项目？')) return
    alert('已删除（模拟）')
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/programs/${programId}`}
        className="text-blue-600 hover:underline text-xs"
      >
        编辑
      </Link>
      <button
        onClick={handlePush}
        disabled={pushing}
        className="text-green-600 hover:underline text-xs disabled:opacity-50"
      >
        {pushing ? '推送中...' : '推送'}
      </button>
      <button
        onClick={handleDelete}
        className="text-red-500 hover:underline text-xs"
      >
        删除
      </button>
    </div>
  )
}
