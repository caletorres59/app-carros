import { auth } from '@/lib/auth'
import { Car, ArrowLeftRight, CalendarDays, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const session = await auth()
  const isOwner = session?.user?.role === 'OWNER'

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Bienvenido, {session?.user?.name?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isOwner ? 'Panel de control — FlotaManager' : 'Panel de administración'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5" /> Vehículos
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <ArrowLeftRight className="h-3.5 w-3.5" /> Transacciones
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Días
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">—</p>
            <p className="text-xs text-muted-foreground">trabajados</p>
          </CardContent>
        </Card>

        {isOwner && (
          <Card>
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Ingresos
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-2xl font-bold">—</p>
              <p className="text-xs text-muted-foreground">este mes</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardContent className="pt-6 text-center text-muted-foreground text-sm py-12">
          <Car className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p>Los módulos se están construyendo.</p>
          <p className="mt-1">Usa el menú lateral para navegar.</p>
        </CardContent>
      </Card>
    </div>
  )
}
