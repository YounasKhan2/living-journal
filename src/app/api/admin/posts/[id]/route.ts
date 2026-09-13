import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getAuthorizedUser } from '../../../../../server/auth/authorize'
import { assertSameOrigin } from '../../../../../server/auth/csrf'
import { contentErrorResponse } from '../../../../../server/content/errors'
import { toUiPost } from '../../../../../server/content/presenters'
import { getCmsPostById } from '../../../../../server/content/queries'
import { postPatchSchema } from '../../../../../server/content/schemas'
import { deleteDraft, updatePostDraft } from '../../../../../server/content/service'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const user = await getAuthorizedUser('cms:read')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await context.params
  const post = await getCmsPostById(id)
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })
  return NextResponse.json({ post: toUiPost(post), revisions: post.revisions })
}

export async function PATCH(request: Request, context: RouteContext) {
  const user = await getAuthorizedUser('content:write')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  try {
    const { id } = await context.params
    const body = await request.json()
    const patch = postPatchSchema.parse(body)
    const post = await updatePostDraft(id, patch, user.id)
    return NextResponse.json({ post: toUiPost(post) })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid post payload.', issues: error.issues }, { status: 400 })
    }
    const mapped = contentErrorResponse(error)
    return NextResponse.json({ error: mapped.error }, { status: mapped.status })
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const user = await getAuthorizedUser('content:write')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  try {
    const { id } = await context.params
    await deleteDraft(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    const mapped = contentErrorResponse(error)
    return NextResponse.json({ error: mapped.error }, { status: mapped.status })
  }
}
