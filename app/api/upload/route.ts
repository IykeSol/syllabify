import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { signUpload } from '@/lib/cloudinary'

/**
 * Returns signed Cloudinary upload params. Admin-only. The client uses these
 * to upload the file directly to Cloudinary — the API secret never leaves
 * the server.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()

  if (!user || !adminEmail || user.email?.toLowerCase() !== adminEmail) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    folder?: string
    resourceType?: 'image' | 'video' | 'raw' | 'auto'
  }
  const folder = body.folder ?? 'syllabify'

  const { timestamp, signature, apiKey, cloudName } = signUpload({ folder })

  return NextResponse.json({
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder,
    resourceType: body.resourceType ?? 'auto',
  })
}
