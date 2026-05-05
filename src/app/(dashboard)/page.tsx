import { auth } from '@/lib/auth'
import { Car, ArrowLeftRight, CalendarDays, TrendingUp, AlertCircle, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { VEHICLES_DATA } from '@/types'

export default async function DashboardPage() {
  const session = await auth()
  const isOwner = session?.user?.role === 'OWNER'
  const firstName = session?.user?.name?.split(' ')[0]

  const activeVehicles = VEHICLES_DATA.filter(v => v.status === 'ACTIVE')

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Hola, {firstName}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {new Date().toLocaleDateString('es-CO', {
              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
              timeZone: 'America/Bogota',
            })}
          </p>
        </div>
        <Link href="/transactions/new">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            Nueva transacción
          </Button>
        </Link>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Vehículos</p>
              <div className="bg-blue-50 p-1.5 rounded-md">
                <Car className="h-3.5 w-3.5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">{activeVehicles.length}</p>
            <p className="text-xs text-muted-foreground mt-1">activos este mes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Registros</p>
              <div className="bg-violet-50 p-1.5 rounded-md">
                <ArrowLeftRight className="h-3.5 w-3.5 text-violet-600" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">0</p>
            <p className="text-xs text-muted-foreground mt-1">este mes</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Días</p>
              <div className="bg-green-50 p-1.5 rounded-md">
                <CalendarDays className="h-3.5 w-3.5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold tracking-tight">—</p>
            <p className="text-xs text-muted-foreground mt-1">trabajados</p>
          </CardContent>
        </Card>

        {isOwner && (
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Ingresos</p>
                <div className="bg-emerald-50 p-1.5 rounded-md">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                </div>
              </div>
              <p className="text-3xl font-bold tracking-tight">—</p>
              <p className="text-xs text-muted-foreground mt-1">este mes</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Vehículos */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Flota
          </h2>
          <Link href="/vehicles" className="text-xs text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {activeVehicles.map((v) => (
            <Link key={v.plate} href={`/vehicles/${v.plate}`}>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4 pb-4 px-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-semibold tracking-widest">
                      {v.plate}
                    </span>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {v.alias}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {v.brand} {v.model}
                  </p>
                  {v.currentKm && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {v.currentKm.toLocaleString('es-CO')} km
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Estado del admin: qué falta registrar */}
      {!isOwner && (
        <Card className="border-0 shadow-sm bg-amber-50 border-l-4 border-l-amber-400">
          <CardContent className="pt-4 pb-4 px-5 flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Pendiente esta semana
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Registra los pagos semanales de los conductores.
              </p>
              <Link href="/transactions/new">
                <Button size="sm" variant="outline" className="mt-2 h-7 text-xs border-amber-300 text-amber-800 hover:bg-amber-100">
                  Registrar pago
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
