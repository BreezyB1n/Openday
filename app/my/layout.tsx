// app/my/layout.tsx
// Route-level layout for /my. Fills the viewport so left and right columns
// scroll independently. Footer is not rendered (my page is a full-screen app).

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100svh-72px)] overflow-hidden">
      {children}
    </div>
  )
}
