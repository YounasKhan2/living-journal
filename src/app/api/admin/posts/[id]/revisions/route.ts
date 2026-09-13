import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'
import { getAuthorizedUser } from '../../../../../../server/auth/authorize'
import { assertSameOrigin } from '../../../../../../server/auth/csrf'
import { contentErrorResponse } from '../../../../../../server/content/errors'
import { toUiPost } from '../../../../../../server/content/presenters'
import { prisma } from '../../../../../../server/db/prisma'
import { restorePostRevision } from '../../../../../../server/content/service'

type RouteContext = { params: Promise<{ id: string }> }

const restoreRevisionSchema = z.object({
  revisionId: z.string().min(1).max(191),
})

export async function GET(_request: Request, context: RouteContext) {
  const user = await getAuthorizedUser('cms:read')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  const { id } = await context.params
  const post = await prisma.post.findUnique({ where: { id }, select: { id: true } })
  if (!post) return NextResponse.json({ error: 'Post not found.' }, { status: 404 })

  const revisions = await prisma.postRevision.findMany({
    where: { postId: id },
    orderBy: { version: 'desc' },
    select: {
      id: true,
      version: true,
      createdAt: true,
      createdBy: { select: { id: true, name: true, email: true } },
    },
    take: 50,
  })

  return NextResponse.json({ revisions })
}

export async function POST(request: Request, context: RouteContext) {
  const user = await getAuthorizedUser('content:write')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  try {
    const { id } = await context.params
    const input = restoreRevisionSchema.parse(await request.json())
    const post = await restorePostRevision(id, input.revisionId, user.id)
    return NextResponse.json({ post: toUiPost(post) })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid revision restore payload.', issues: error.issues }, { status: 400 })
    }
    const mapped = contentErrorResponse(error)
    return NextResponse.json({ error: mapped.error }, { status: mapped.status })
  }
}
