import { NextResponse } from 'next/server'
import { getAuthorizedUser } from '../../../../../../../../server/auth/authorize'
import { assertSameOrigin } from '../../../../../../../../server/auth/csrf'
import { contentErrorResponse } from '../../../../../../../../server/content/errors'
import { toUiPost } from '../../../../../../../../server/content/presenters'
import { restorePostRevision } from '../../../../../../../../server/content/service'

type RouteContext = { params: Promise<{ id: string; revisionId: string }> }

export async function POST(request: Request, context: RouteContext) {
  const user = await getAuthorizedUser('content:write')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  try {
    const { id, revisionId } = await context.params
    const post = await restorePostRevision(id, revisionId, user.id)
    return NextResponse.json({ post: toUiPost(post) })
  } catch (error) {
    const mapped = contentErrorResponse(error)
    return NextResponse.json({ error: mapped.error }, { status: mapped.status })
  }
}
