// app/my/PaperCard.tsx
// Displays a single paper/research entry (read-only view).
import type { Paper } from '@/lib/types'

export default function PaperCard({ item }: { item: Paper }) {
  return (
    <div className="border border-border bg-bg-primary p-3 mb-1">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 mr-3">
          <div className="text-[10px] font-bold leading-snug">{item.title}</div>
          <div className="text-[9px] text-text-secondary mt-0.5">{item.authorOrder}</div>
        </div>
        <div className="text-[9px] text-text-muted tracking-[0.05em] whitespace-nowrap">
          {item.year}
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {/* Venue is highlighted */}
        <span className="bg-bg-inverse text-text-inverse border border-bg-inverse text-[8px] tracking-[0.05em] px-1.5 py-0.5">
          {item.venue}
        </span>
        {item.tags.map(tag => (
          <span key={tag} className="border border-border text-[8px] tracking-[0.05em] px-1.5 py-0.5 text-text-secondary">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
