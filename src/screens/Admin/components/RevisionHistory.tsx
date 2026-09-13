'use client'

import { ArrowCounterClockwise, ClockCounterClockwise } from 'phosphor-react'
import type { PostRevisionSummary } from '../cmsApi'

type RevisionHistoryProps = {
  revisions: PostRevisionSummary[]
  loading: boolean
  pendingRevisionId?: string
  onRestore: (revision: PostRevisionSummary) => Promise<void>
}

function formatRevisionDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function RevisionHistory({ revisions, loading, pendingRevisionId, onRestore }: RevisionHistoryProps) {
  return <section className="editor-panel revision-panel">
    <div className="revision-panel__head">
      <div><span>History</span><h2>Revisions</h2></div>
      <ClockCounterClockwise size={20}/>
    </div>
    {loading ? <p className="editor-help">Loading revision history…</p> : revisions.length === 0 ? <p className="editor-help">No revisions have been recorded yet.</p> : <div className="revision-list">
      {revisions.map((revision, index) => <article key={revision.id} className="revision-item">
        <div>
          <strong>Version {revision.version}</strong>
          <span>{formatRevisionDate(revision.createdAt)}</span>
          <small>{revision.createdBy.name} · {revision.createdBy.email}</small>
        </div>
        {index === 0 ? <span className="revision-current">Current</span> : <button disabled={Boolean(pendingRevisionId)} type="button" className="revision-restore" onClick={() => void onRestore(revision)}><ArrowCounterClockwise size={15}/>{pendingRevisionId === revision.id ? 'Restoring…' : 'Restore'}</button>}
      </article>)}
    </div>}
    <p className="editor-help">Restoring an older version creates a new draft revision. Existing history is never overwritten.</p>
  </section>
}
