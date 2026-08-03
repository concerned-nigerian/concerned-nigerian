import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// R2 credentials are only used server-side (Cloudflare Worker).
// This client is for generating presigned URLs from a Worker — never expose secret keys in the browser.
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL

/**
 * Given a file key, returns the public CDN URL for that image.
 * e.g. getPublicUrl('avatars/user123.jpg')
 */
export function getPublicUrl(key) {
  return `${R2_PUBLIC_URL}/${key}`
}

/**
 * Uploads a file to R2 via a presigned URL obtained from our Cloudflare Worker.
 * Returns the public URL of the uploaded file.
 *
 * @param {File} file - The file to upload
 * @param {string} folder - e.g. 'avatars', 'posts', 'covers'
 * @returns {Promise<string>} public URL
 */
export async function uploadToR2(file, folder = 'uploads') {
  const ext = file.name.split('.').pop()
  const key = `${folder}/${crypto.randomUUID()}.${ext}`

  // Get presigned URL from our Worker
  const res = await fetch(`/api/r2-presign?key=${encodeURIComponent(key)}&type=${encodeURIComponent(file.type)}`)
  if (!res.ok) throw new Error('Failed to get upload URL')
  const { url } = await res.json()

  // Upload directly to R2 using the presigned URL
  const uploadRes = await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  })
  if (!uploadRes.ok) throw new Error('Upload to R2 failed')

  return getPublicUrl(key)
}

/**
 * Deletes a file from R2 via key (extracted from the public URL).
 * e.g. deleteFromR2('avatars/user123.jpg')
 */
export async function deleteFromR2(key) {
  await fetch(`/api/r2-delete?key=${encodeURIComponent(key)}`, { method: 'DELETE' })
}
