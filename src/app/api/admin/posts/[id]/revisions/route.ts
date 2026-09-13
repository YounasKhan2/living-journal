import { NextResponse } from 'next/server'
import { getAuthorizedUser } from '../../../../../../server/auth/authorize'
import { prisma } from '../../../../../../server/db/prisma'

type RouteContext = { params: Promise<{ id: string }> }

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
