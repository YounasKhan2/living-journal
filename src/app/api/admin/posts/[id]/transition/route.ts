import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { getAuthorizedUser } from '../../../../../../server/auth/authorize'
import { assertSameOrigin } from '../../../../../../server/auth/csrf'
import { contentErrorResponse } from '../../../../../../server/content/errors'
import { transitionInputSchema } from '../../../../../../server/content/schemas'
import { transitionPost } from '../../../../../../server/content/service'

type RouteContext = { params: Promise<{ id: string }> }

export async function POST(request: Request, context: RouteContext) {
  const user = await getAuthorizedUser('content:publish')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  try {
    const { id } = await context.params
    const body = await request.json()
    const input = transitionInputSchema.parse(body)
    const post = await transitionPost(id, input.status, user.id, input.scheduledAt)
    return NextResponse.json({ post })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid transition payload.', issues: error.issues }, { status: 400 })
    }
    const mapped = contentErrorResponse(error)
    return NextResponse.json({ error: mapped.error }, { status: mapped.status })
  }
}
