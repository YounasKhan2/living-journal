import type { ReactNode } from 'react'

export function SectionHeading({ eyebrow, title, action }: { eyebrow?: string; title: ReactNode; action?: ReactNode }) {
  return <div className="section-heading reveal">
    <div>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2>{title}</h2>
    </div>
    {action ? <div className="section-heading__action">{action}</div> : null}
  </div>
}
