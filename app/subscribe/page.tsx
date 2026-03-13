'use client'
import { useState } from 'react'
import Link from 'next/link'

const FIELDS = [
  { value: 'Computer Science', label: 'CS' },
  { value: 'Business', label: 'BUSINESS' },
  { value: 'Engineering', label: 'ENG' },
  { value: 'Data Science', label: 'DS' },
  { value: 'Public Policy', label: 'POLICY' },
  { value: 'Medicine', label: 'MED' },
]

const COUNTRIES = [
  { code: 'US', label: 'USA' },
  { code: 'UK', label: 'UK' },
  { code: 'AU', label: 'AU' },
  { code: 'CA', label: 'CA' },
  { code: 'SG', label: 'SG' },
  { code: 'DE', label: 'DE' },
]

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 text-[10px] tracking-[0.08em] border transition-colors ${
        active
          ? 'bg-bg-inverse text-text-inverse border-bg-inverse'
          : 'bg-bg-primary border-border text-text-secondary hover:bg-bg-secondary hover:border-text-secondary'
      }`}
    >
      {label}
    </button>
  )
}

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [degrees, setDegrees] = useState<string[]>([])
  const [fields, setFields] = useState<string[]>([])
  const [countries, setCountries] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function validate() {
    const errs: Record<string, string> = {}
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = '请输入有效的邮箱地址'
    if (degrees.length === 0) errs.degrees = '请至少选择一个学位层级'
    if (fields.length === 0) errs.fields = '请至少选择一个专业方向'
    if (fields.length > 5) errs.fields = '最多选择 5 个'
    if (countries.length === 0) errs.countries = '请至少选择一个目标国家'
    if (countries.length > 3) errs.countries = '最多选择 3 个'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  function toggle<T>(arr: T[], val: T): T[] {
    return arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6">
        <div className="border border-border bg-bg-primary p-10 max-w-md w-full text-center">
          <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">CONNECTION_STATUS //</p>
          <h2 className="text-xl font-black tracking-tight mb-2">VERIFICATION SENT.</h2>
          <p className="font-sans text-[13px] text-text-secondary mb-6">
            验证邮件已发送至 <strong>{email}</strong>，请点击链接完成订阅。
          </p>
          <Link href="/" className="text-accent-blue text-[11px] tracking-[0.08em] hover:underline">
            ← BACK TO PROGRAMS
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary grid grid-cols-1 lg:grid-cols-[1fr_480px_1fr]">
      {/* Left info panel */}
      <div className="hidden lg:block bg-bg-secondary border-r border-border p-10">
        <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">
          NOTIFICATION_SERVICE // SETUP
        </p>
        <h2 className="text-3xl font-black tracking-[-0.05em] leading-[1.05] mb-4">
          NEVER<br />MISS AN<br />OPENING.
        </h2>
        <p className="font-sans text-[13px] text-text-secondary leading-relaxed mb-10">
          设置你的目标偏好，当符合条件的项目开放申请时，我们会在 1 小时内发送邮件通知。
        </p>
        <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">HOW_IT_WORKS //</p>
        {[
          ['01', '填写邮箱，设置学位、专业方向和目标国家偏好'],
          ['02', '验证邮箱，激活订阅'],
          ['03', '项目开放申请时，1小时内收到邮件通知'],
          ['04', '随时取消订阅，一键退出'],
        ].map(([num, text]) => (
          <div key={num} className="flex gap-3 mb-4 items-start">
            <span className="text-[10px] tracking-[0.1em] text-text-muted border border-border px-1.5 py-0.5 shrink-0">
              {num}
            </span>
            <span className="font-sans text-[12px] text-text-secondary leading-relaxed">{text}</span>
          </div>
        ))}
      </div>

      {/* Center form */}
      <div className="border-r border-border">
        <div className="bg-bg-inverse px-6 py-5">
          <p className="text-[9px] tracking-[0.2em] text-[#555] mb-1">
            REQ_ACCESS // INITIALIZE_CONNECTION
          </p>
          <h1 className="text-[15px] font-black tracking-tight text-text-inverse">
            SUBSCRIPTION SETUP
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email */}
          <div>
            <p className="text-[9px] tracking-[0.15em] text-text-muted mb-0.5">TERMINAL_ID // EMAIL</p>
            <p className="font-sans text-[11px] text-text-secondary mb-2">邮箱地址</p>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com_"
              className="w-full border border-border bg-white px-3 py-2 text-[13px] placeholder-text-muted focus:outline-none focus:border-accent-blue"
            />
            {errors.email && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.email}</p>}
          </div>

          <hr className="border-border-light" />

          {/* Degree */}
          <div>
            <p className="text-[9px] tracking-[0.15em] text-text-muted mb-0.5">DEGREE_LEVEL //</p>
            <p className="font-sans text-[11px] text-text-secondary mb-2">学位层级</p>
            <div className="flex flex-wrap gap-1.5">
              {[{v:'bachelor',l:'BACHELOR'},{v:'master',l:'MASTER'},{v:'phd',l:'PHD'}].map(d => (
                <Chip
                  key={d.v}
                  label={d.l}
                  active={degrees.includes(d.v)}
                  onClick={() => setDegrees(toggle(degrees, d.v))}
                />
              ))}
            </div>
            {errors.degrees && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.degrees}</p>}
          </div>

          <hr className="border-border-light" />

          {/* Field */}
          <div>
            <p className="text-[9px] tracking-[0.15em] text-text-muted mb-0.5">FIELD_OF_STUDY //</p>
            <p className="font-sans text-[11px] text-text-secondary mb-2">专业方向，最多5个</p>
            <div className="flex flex-wrap gap-1.5">
              {FIELDS.map(f => (
                <Chip
                  key={f.value}
                  label={f.label}
                  active={fields.includes(f.value)}
                  onClick={() => setFields(toggle(fields, f.value))}
                />
              ))}
            </div>
            {errors.fields && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.fields}</p>}
          </div>

          <hr className="border-border-light" />

          {/* Country */}
          <div>
            <p className="text-[9px] tracking-[0.15em] text-text-muted mb-0.5">TARGET_COUNTRY //</p>
            <p className="font-sans text-[11px] text-text-secondary mb-2">目标国家，最多3个</p>
            <div className="flex flex-wrap gap-1.5">
              {COUNTRIES.map(c => (
                <Chip
                  key={c.code}
                  label={c.label}
                  active={countries.includes(c.code)}
                  onClick={() => setCountries(toggle(countries, c.code))}
                />
              ))}
            </div>
            {errors.countries && <p className="text-red-500 text-[11px] mt-1 font-sans">{errors.countries}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-blue text-white text-[11px] tracking-[0.15em] py-3.5 hover:bg-accent-blue-dark disabled:opacity-50 transition-colors"
          >
            {loading ? 'CONNECTING...' : 'INITIALIZE CONNECTION →'}
          </button>
          <p className="text-center text-[10px] text-text-muted font-sans">
            提交后将发送验证邮件 · 验证后订阅生效
          </p>
        </form>
      </div>

      {/* Right status panel */}
      <div className="hidden lg:block p-10">
        <p className="text-[9px] tracking-[0.2em] text-text-muted mb-4">SYSTEM_STATUS //</p>
        <div className="border border-border mb-4">
          <div className="bg-bg-inverse px-4 py-2">
            <span className="text-[9px] tracking-[0.15em] text-[#555]">NOTIFICATION_SERVICE</span>
          </div>
          {[
            { k: 'CORE', v: 'ONLINE', c: 'text-accent-green' },
            { k: 'LATENCY', v: '≤ 1HR', c: '' },
            { k: 'PROGRAMS', v: '200', c: 'text-accent-blue' },
            { k: 'SUBSCRIBERS', v: '1,241', c: 'text-accent-blue' },
            { k: 'ALERTS_SENT', v: '8,392', c: '' },
          ].map(({ k, v, c }) => (
            <div key={k} className="flex justify-between px-4 py-2.5 border-t border-border">
              <span className="text-[10px] tracking-[0.1em] text-text-muted">{k}</span>
              <span className={`text-[10px] tracking-[0.1em] font-bold ${c}`}>{v}</span>
            </div>
          ))}
        </div>

        <div className="bg-bg-secondary border border-border p-4">
          <p className="text-[9px] tracking-[0.2em] text-text-muted mb-3">TERMS //</p>
          {[
            '申请窗口开放 1 小时内推送通知',
            '3 个维度精准匹配：学位 × 方向 × 国家',
            '不发送广告或无关邮件',
            '随时一键取消订阅',
          ].map(text => (
            <div key={text} className="flex gap-2 mb-2">
              <span className="text-[10px] tracking-[0.05em] text-accent-green shrink-0">[+]</span>
              <span className="font-sans text-[12px] text-text-secondary">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
