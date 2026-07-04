import { Suspense } from 'react'
import type { Metadata } from 'next'
import { AuthForm } from '@/components/auth/auth-form'

export const metadata: Metadata = { title: 'Log in' }

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <AuthForm mode="login" />
    </Suspense>
  )
}
