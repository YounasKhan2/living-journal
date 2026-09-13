import { NextResponse } from 'next/server'
import { getAuthorizedUser } from '../../../../server/auth/authorize'
import { assertSameOrigin } from '../../../../server/auth/csrf'
import { prisma } from '../../../../server/db/prisma'
import { uploadImageToCloudinary } from '../../../../server/media/cloudinary'

const MAX_IMAGE_BYTES = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(request: Request) {
  const user = await getAuthorizedUser('content:write')
  if (!user) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })

  try {
    assertSameOrigin(request)
  } catch {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }

  const form = await request.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Invalid upload payload.' }, { status: 400 })

  const file = form.get('file')
  const altText = String(form.get('altText') ?? '').trim()
  const attribution = String(form.get('attribution') ?? '').trim()

  if (!(file instanceof File)) return NextResponse.json({ error: 'Image file is required.' }, { status: 400 })
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) return NextResponse.json({ error: 'Only JPEG, PNG and WebP images are supported.' }, { status: 415 })
  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) return NextResponse.json({ error: 'Image must be 10 MB or smaller.' }, { status: 413 })
  if (!altText || altText.length > 500) return NextResponse.json({ error: 'Alt text is required and must be 500 characters or fewer.' }, { status: 400 })
  if (attribution.length > 1000) return NextResponse.json({ error: 'Attribution must be 1000 characters or fewer.' }, { status: 400 })

  try {
    const stored = await uploadImageToCloudinary(file)
    const asset = await prisma.mediaAsset.create({
      data: {
        provider: stored.provider,
        storageKey: stored.storageKey,
        url: stored.url,
        mimeType: file.type,
        bytes: stored.bytes ?? file.size,
        width: stored.width,
        height: stored.height,
        altText,
        attribution: attribution || null,
        createdById: user.id,
      },
    })

    return NextResponse.json({
      asset: {
        id: asset.id,
        url: asset.url,
        altText: asset.altText,
        attribution: asset.attribution,
        mimeType: asset.mimeType,
        bytes: asset.bytes,
        width: asset.width,
        height: asset.height,
      },
    }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : ''
    if (message === 'MEDIA_STORAGE_NOT_CONFIGURED') {
      return NextResponse.json({ error: 'Media storage is not configured. Add the Cloudinary server environment variables.' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Unable to upload the image.' }, { status: 502 })
  }
}
