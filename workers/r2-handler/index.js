/**
 * Cloudflare Worker — R2 presigned upload handler
 * Deploy this worker and set these secrets via `wrangler secret put`:
 *   R2_ACCESS_KEY_ID
 *   R2_SECRET_ACCESS_KEY
 *   R2_ENDPOINT
 *   R2_BUCKET_NAME
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

function getS3Client(env) {
  return new S3Client({
    region: 'auto',
    endpoint: env.R2_ENDPOINT,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  })
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS })
    }

    const url = new URL(request.url)
    const s3 = getS3Client(env)

    // GET /r2-presign?key=...&type=... → returns a presigned PUT URL
    if (request.method === 'GET' && url.pathname === '/r2-presign') {
      const key = url.searchParams.get('key')
      const contentType = url.searchParams.get('type') || 'application/octet-stream'

      if (!key) return new Response('Missing key', { status: 400 })

      const command = new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: key,
        ContentType: contentType,
      })

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 })

      return new Response(JSON.stringify({ url: signedUrl }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    // DELETE /r2-delete?key=... → deletes an object
    if (request.method === 'DELETE' && url.pathname === '/r2-delete') {
      const key = url.searchParams.get('key')
      if (!key) return new Response('Missing key', { status: 400 })

      await s3.send(new DeleteObjectCommand({ Bucket: env.R2_BUCKET_NAME, Key: key }))

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Not found', { status: 404 })
  },
}
