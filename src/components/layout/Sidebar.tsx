'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  Car, LayoutDashboard, ArrowLeftRight,
  CalendarDays, LogOut, Menu, X,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/',               label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/vehicles',       label: 'Vehículos',     icon: Car },
  { href: '/transactions',   label: 'Transacciones', icon: ArrowLeftRight },
  { href: '/worked-days',    label: 'Días trabajados', icon: CalendarDays },
]

interface Props {
  userName: string
  userRole: string
}

export function Sidebar({ userName, userRole }: Props) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const NavLinks = () => (
    <nav className="flex-1 space-y-1 px-2">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
            pathname === href
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  )

  const UserFooter = () => (
    <div className="border-t p-3 space-y-1">
      <div className="px-3 py-1">
        <p className="text-sm font-medium truncate">{userName}</p>
        <p className="text-xs text-muted-foreground">
          {userRole === 'OWNER' ? 'Dueño' : 'Administradora'}
        </p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground w-full transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 border-r bg-background h-screen sticky top-0">
        <div className="flex items-center gap-2 px-5 py-4 border-b">
          <div className="bg-primary rounded-lg p-1.5">
            <Car className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">FlotaManager</span>
        </div>
        <div className="flex-1 py-3 overflow-y-auto">
          <NavLinks />
        </div>
        <UserFooter />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-lg p-1.5">
            <Car className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">FlotaManager</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-background flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <div className="flex items-center gap-2">
                <div className="bg-primary rounded-lg p-1.5">
                  <Car className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm">FlotaManager</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 py-3">
              <NavLinks />
            </div>
            <UserFooter />
          </aside>
        </div>
      )}
    </>
  )
}
