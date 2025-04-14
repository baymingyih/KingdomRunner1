"use client"

import { ReactNode } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) return <div>Loading...</div>
  
  // Redirect if not admin
  if (!user?.isAdmin) {
    router.push('/')
    return null
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-8">
        {children}
      </main>
    </div>
  )
}
