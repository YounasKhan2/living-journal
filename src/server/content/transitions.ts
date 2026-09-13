import type { PostStatusValue } from './schemas'

const allowedTransitions: Record<PostStatusValue, ReadonlySet<PostStatusValue>> = {
  DRAFT: new Set(['IN_REVIEW']),
  IN_REVIEW: new Set(['DRAFT', 'SCHEDULED', 'PUBLISHED']),
  SCHEDULED: new Set(['DRAFT', 'PUBLISHED']),
  PUBLISHED: new Set(['ARCHIVED']),
  ARCHIVED: new Set(['DRAFT']),
}

export function canTransitionPost(from: PostStatusValue, to: PostStatusValue) {
  return from === to || allowedTransitions[from].has(to)
}

export function assertPostTransition(from: PostStatusValue, to: PostStatusValue) {
  if (!canTransitionPost(from, to)) {
    throw new Error(`INVALID_POST_TRANSITION:${from}->${to}`)
  }
}
