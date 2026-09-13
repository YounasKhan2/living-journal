import 'server-only'

import { createHash } from 'node:crypto'

export type StoredImage = {
  provider: 'cloudinary'
  storageKey: string
  url: string
  bytes?: number
  width?: number
  height?: number
}

function cloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloudName || !apiKey || !apiSecret) return null
  return { cloudName, apiKey, apiSecret }
}

export function isMediaStorageConfigured() {
  return Boolean(cloudinaryConfig())
}

export async function uploadImageToCloudinary(file: File): Promise<StoredImage> {
  const config = cloudinaryConfig()
  if (!config) throw new Error('MEDIA_STORAGE_NOT_CONFIGURED')

  const timestamp = Math.floor(Date.now() / 1000)
  const folder = 'living-journal'
  const signatureBase = `folder=${folder}&timestamp=${timestamp}${config.apiSecret}`
  const signature = createHash('sha1').update(signatureBase).digest('hex')

  const form = new FormData()
  form.set('file', file)
  form.set('api_key', config.apiKey)
  form.set('timestamp', String(timestamp))
  form.set('folder', folder)
  form.set('signature', signature)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`, {
    method: 'POST',
    body: form,
  })

  const payload = await response.json().catch(() => null) as null | {
    public_id?: string
    secure_url?: string
    bytes?: number
    width?: number
    height?: number
    error?: { message?: string }
  }

  if (!response.ok || !payload?.public_id || !payload.secure_url) {
    throw new Error(payload?.error?.message ? `MEDIA_UPLOAD_FAILED:${payload.error.message}` : 'MEDIA_UPLOAD_FAILED')
  }

  return {
    provider: 'cloudinary',
    storageKey: payload.public_id,
    url: payload.secure_url,
    bytes: payload.bytes,
    width: payload.width,
    height: payload.height,
  }
}
