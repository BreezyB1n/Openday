import Link from 'next/link'

const messages = {
  success: {
    code: 'CONNECTION_VERIFIED',
    title: 'SUBSCRIPTION ACTIVE.',
    body: '您已成功验证邮箱。我们将在目标项目申请开放时第一时间通知您。',
    titleColor: 'text-accent-green',
  },
  invalid: {
    code: 'CONNECTION_FAILED',
    title: 'INVALID TOKEN.',
    body: '该验证链接无效，请重新订阅。',
    titleColor: 'text-accent-orange',
  },
  expired: {
    code: 'TOKEN_EXPIRED',
    title: 'LINK EXPIRED.',
    body: '验证链接已过期（24小时有效），请重新订阅。',
    titleColor: 'text-accent-yellow',
  },
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const msg = messages[status as keyof typeof messages] ?? messages.invalid

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
      <div className="border border-border bg-bg-primary p-10 max-w-md w-full text-center">
        <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">{msg.code}</p>
        <h2 className={`text-xl font-black tracking-tight mb-3 ${msg.titleColor}`}>
          {msg.title}
        </h2>
        <p className="font-sans text-[13px] text-text-secondary mb-6">{msg.body}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="text-accent-blue text-[11px] tracking-[0.08em] hover:underline">
            ← PROGRAMS
          </Link>
          {status !== 'success' && (
            <Link href="/subscribe" className="text-accent-blue text-[11px] tracking-[0.08em] hover:underline">
              RESUBSCRIBE →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
