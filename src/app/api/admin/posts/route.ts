import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getAuthorizedUser } from '../../../../server/auth/authorize'
import { assertSameOrigin } from '../../../../server/auth/csrf'
import { contentErrorResponse } from '../../../../server/content/errors'
import { toUiPost } from '../../../../server/content/presenters'
import { listCmsPosts } from '../../../../server/content/queries'
import { postInputSchema } from '../../../../server/content/schemas'
import { createPostDraft } from '../../../../server/content/service'

export async function GET() {
  const user = await getAuthorizedUser('cms:read')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const posts = await listCmsPosts()
  return NextResponse.json({ posts: posts.map(toUiPost) })
}

export async function POST(request: Request) {
  const user = await getAuthorizedUser('content:write')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const input = postInputSchema.parse(body)
    const post = await createPostDraft(input, user.id)
    return NextResponse.json({ post: toUiPost(post) }, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid post payload.', issues: error.issues }, { status: 400 })
    }
    const mapped = contentErrorResponse(error)
    return NextResponse.json({ error: mapped.error }, { status: mapped.status })
  }
}
