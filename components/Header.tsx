import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b-2 border-bg-inverse bg-bg-primary sticky top-0 z-50">
      <div className="flex items-stretch">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center font-bold text-base tracking-tight px-6 border-r border-border py-3.5"
        >
          OPEN<span className="text-accent-blue">DAY</span>
          <span className="text-text-muted text-[10px] font-normal ml-1">// v1</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-stretch flex-1">
          <Link
            href="/"
            className="flex items-center text-[10px] tracking-[0.15em] text-text-secondary hover:bg-bg-secondary hover:text-text-primary px-4 border-r border-border transition-colors"
          >
            01. PROGRAMS
          </Link>
          <Link
            href="/subscribe"
            className="flex items-center text-[10px] tracking-[0.15em] text-text-secondary hover:bg-bg-secondary hover:text-text-primary px-4 border-r border-border transition-colors"
          >
            02. SUBSCRIBE
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center px-6">
          <Link
            href="/subscribe"
            className="bg-accent-blue text-white text-[10px] tracking-[0.15em] px-4 py-2 hover:bg-accent-blue-dark transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-blue focus-visible:outline-offset-2"
          >
            SUBSCRIBE →
          </Link>
        </div>
      </div>
    </header>
  )
}
