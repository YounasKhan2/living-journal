'use client'

import { useState, type ChangeEvent } from 'react'
import { ImageSquare, UploadSimple } from 'phosphor-react'
import type { Post } from '../../../types/content'
import { uploadMedia, type UploadedMediaAsset } from '../cmsApi'

type CoverMediaUploaderProps = {
  post: Post
  onUploaded: (asset: UploadedMediaAsset) => void
}

export function CoverMediaUploader({ post, onUploaded }: CoverMediaUploaderProps) {
  const [altText, setAltText] = useState(post.imageAlt || post.title || '')
  const [attribution, setAttribution] = useState(post.imageAttribution || '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!altText.trim()) {
      setError('Add meaningful alt text before uploading the image.')
      return
    }

    setPending(true)
    setError('')
    try {
      const asset = await uploadMedia(file, altText.trim(), attribution)
      onUploaded(asset)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to upload the image.')
    } finally {
      setPending(false)
    }
  }

  return <div className="cover-media-upload">
    <div className="cover-media-upload__preview">{post.image ? <img src={post.image} alt={post.imageAlt || ''}/> : <ImageSquare size={28}/>}</div>
    <label>Image alt text<input value={altText} maxLength={500} onChange={event => setAltText(event.target.value)} placeholder="Describe the image for readers using assistive technology"/></label>
    <label>Attribution<input value={attribution} maxLength={1000} onChange={event => setAttribution(event.target.value)} placeholder="Optional photographer/source credit"/></label>
    <label className="cover-media-upload__button"><UploadSimple size={16}/>{pending ? 'Uploading…' : 'Upload cover image'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={pending} onChange={handleFile}/></label>
    <small>JPEG, PNG or WebP · max 10 MB. Uploads use configured Cloudinary storage.</small>
    {error ? <p className="cover-media-upload__error" role="alert">{error}</p> : null}
  </div>
}
