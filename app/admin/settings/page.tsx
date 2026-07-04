import type { Metadata } from 'next'
import { CheckCircle2, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ADMIN_EMAIL, isSupabaseConfigured } from '@/lib/constants'

export const metadata: Metadata = { title: 'Admin · Settings' }

function StatusRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm">{label}</span>
      {ok ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-emerald-600">
          <CheckCircle2 className="size-4" /> Connected
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <XCircle className="size-4" /> Not configured
        </span>
      )}
    </div>
  )
}

export default function AdminSettings() {
  const supabaseOk = isSupabaseConfigured()
  const cloudinaryOk = Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'demo')
  const adsenseOk = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-muted-foreground">
          Connection status for your integrations.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Admin account</p>
            <p className="text-sm text-muted-foreground">
              {ADMIN_EMAIL || 'Set ADMIN_EMAIL in your environment'}
            </p>
          </div>
          <Badge variant="secondary">Owner</Badge>
        </div>
      </Card>

      <Card className="divide-y divide-border p-6 pt-2">
        <StatusRow label="Supabase (database & auth)" ok={supabaseOk} />
        <StatusRow label="Cloudinary (file storage)" ok={cloudinaryOk} />
        <StatusRow label="Google AdSense" ok={adsenseOk} />
      </Card>

      <p className="text-xs text-muted-foreground">
        Configure these in <code className="font-mono">.env.local</code>. See{' '}
        <code className="font-mono">SETUP.md</code> for the full guide.
      </p>
    </div>
  )
}
