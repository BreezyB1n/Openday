// app/my/page.tsx
// Server component shell. Reads ?token from URL, validates it, and either
// renders the full My Page or an error state.
// MVP: token=dev bypasses validation in development; all other tokens
// are accepted as-is (real validation deferred to auth system).

import { Suspense } from 'react'
import MyPageContent from './MyPageContent'

export default function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <p className="text-[11px] tracking-[0.1em] text-text-muted">LOADING...</p>
      </div>
    }>
      <MyPageInner searchParams={searchParams} />
    </Suspense>
  )
}

async function MyPageInner({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  // No token
  if (!token) {
    return <TokenError code="ACCESS_DENIED" message="请通过邮件中的链接访问" />
  }

  // Dev bypass
  if (token === 'dev' && process.env.NODE_ENV === 'development') {
    return <MyPageContent email="dev@example.com" />
  }

  // MVP token contract: the token IS the subscriber's email (URL-encoded).
  // e.g. the email link is /my?token=user%40example.com
  // Real auth (signed JWT, subscription lookup) replaces this in a later sprint.
  const email = decodeURIComponent(token)
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  if (!isValidEmail) {
    return <TokenError code="INVALID_TOKEN" message="链接无效，请重新订阅" />
  }

  return <MyPageContent email={email} />
}

function TokenError({ code, message }: { code: string; message: string }) {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="border border-border bg-bg-primary p-10 max-w-md w-full text-center">
        <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">{code}</p>
        <h2 className="text-xl font-black tracking-tight text-accent-orange mb-3">
          {code.split('_')[0]}.
        </h2>
        <p className="font-sans text-[13px] text-text-secondary mb-6">{message}</p>
        <a href="/" className="text-accent-blue text-[11px] tracking-[0.08em] hover:underline">
          ← BACK TO PROGRAMS
        </a>
      </div>
    </div>
  )
}
