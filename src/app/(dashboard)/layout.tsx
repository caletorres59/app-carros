import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar
        userName={session.user?.name ?? ''}
        userRole={session.user?.role ?? 'ADMIN'}
      />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
