export function contentErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : ''

  if (message === 'POST_NOT_FOUND') return { status: 404, error: 'Post not found.' }
  if (message === 'REVISION_NOT_FOUND') return { status: 404, error: 'Revision not found.' }
  if (message === 'MEDIA_NOT_FOUND') return { status: 404, error: 'Selected media asset no longer exists.' }
  if (message === 'INVALID_REVISION_SNAPSHOT') return { status: 409, error: 'This revision cannot be restored safely.' }
  if (message === 'POST_SLUG_TAKEN') return { status: 409, error: 'That slug is already in use.' }
  if (message === 'ONLY_DRAFTS_CAN_BE_DELETED') return { status: 409, error: 'Only draft posts can be deleted.' }
  if (message === 'ARCHIVED_POST_READ_ONLY') return { status: 409, error: 'Archived posts must be restored before editing.' }
  if (message === 'INVALID_SCHEDULE_TIME') return { status: 400, error: 'Scheduled publish time must be in the future.' }
  if (message.startsWith('INVALID_POST_TRANSITION:')) return { status: 409, error: 'That publishing transition is not allowed.' }
  if (message === 'INVALID_POST_SLUG' || message === 'INVALID_CATEGORY_SLUG') return { status: 400, error: 'Invalid slug.' }

  return { status: 500, error: 'Unable to complete the content operation.' }
}
