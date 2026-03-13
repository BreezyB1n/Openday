'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function UnsubscribeContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }
    // Simulate API call
    const timer = setTimeout(() => {
      setStatus('success')
    }, 800)
    return () => clearTimeout(timer)
  }, [token])

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <div className="border border-border bg-bg-primary p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">PROCESSING //</p>
            <p className="text-[13px] font-sans text-text-secondary">正在处理退订请求...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">UNSUBSCRIBE_COMPLETE</p>
            <h2 className="text-xl font-black tracking-tight mb-3">UNSUBSCRIBED.</h2>
            <p className="font-sans text-[13px] text-text-secondary mb-6">
              您已退订通知，不再收到申请开放邮件。
            </p>
            <Link href="/" className="text-accent-blue text-[11px] tracking-[0.08em] hover:underline">
              ← BACK TO PROGRAMS
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">TOKEN_INVALID</p>
            <h2 className="text-xl font-black tracking-tight text-accent-orange mb-3">INVALID LINK.</h2>
            <p className="font-sans text-[13px] text-text-secondary mb-6">
              该退订链接无效或已过期。
            </p>
            <Link href="/" className="text-accent-blue text-[11px] tracking-[0.08em] hover:underline">
              ← BACK TO PROGRAMS
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-[11px] tracking-[0.1em] text-text-muted">LOADING...</p>
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  )
}
