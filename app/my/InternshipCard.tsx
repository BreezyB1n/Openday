// app/my/InternshipCard.tsx
// Displays a single internship entry (read-only view).
import type { Internship } from '@/lib/types'

export default function InternshipCard({ item }: { item: Internship }) {
  return (
    <div className="border border-border bg-bg-primary p-3 mb-1">
      <div className="flex justify-between items-start mb-1">
        <div>
          <div className="text-[11px] font-bold">{item.company}</div>
          <div className="text-[10px] text-text-secondary font-sans">
            {item.role}{item.department ? ` · ${item.department}` : ''}
          </div>
        </div>
        <div className="text-[9px] text-text-muted tracking-[0.05em] ml-3 whitespace-nowrap">
          {item.startDate}–{item.endDate}
        </div>
      </div>
      {item.description && (
        <p className="text-[10px] text-text-secondary font-sans leading-relaxed mb-2">
          {item.description}
        </p>
      )}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {item.tags.map(tag => (
            <span key={tag} className="border border-border text-[8px] tracking-[0.05em] px-1.5 py-0.5 text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
