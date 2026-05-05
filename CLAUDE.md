# FlotaManager — Guía de Arquitectura y Mejores Prácticas

## Contexto del proyecto

App web para gestión de flota de vehículos Uber en Pereira, Colombia.
- **Stack**: Next.js 16 + TypeScript + shadcn/ui + Google Sheets API
- **Usuarios**: dueño (Carlos) + administradora remota (Sara)
- **Datos fase A**: Google Sheets como fuente de verdad
- **Datos fase B**: PostgreSQL + Prisma (cuando la app esté en producción)

---

## Reglas de arquitectura

### 1. Server Components por defecto

Next.js 16 usa Server Components por defecto. Seguir este principio estrictamente:

```
Server Component (sin directiva)  → fetch de datos, layouts, páginas estáticas
Client Component ('use client')   → interactividad, estado, eventos del usuario
```

**Regla**: Un componente solo lleva `'use client'` si usa `useState`, `useEffect`,
`onClick`, `onChange`, u otras APIs del navegador. Si solo muestra datos, es Server.

```tsx
// ✅ Server Component — fetch directo sin hooks
export default async function VehiclesPage() {
  const vehicles = await getVehiclesFromSheet()
  return <VehicleList vehicles={vehicles} />
}

// ✅ Client Component — necesita estado
'use client'
export function VehicleForm({ onSubmit }: Props) {
  const [form, setForm] = useState({})
  ...
}
```

### 2. Separación de capas

```
app/(rutas)/     → solo orquestación: obtiene datos y pasa props
components/      → solo UI: recibe props y renderiza
lib/             → solo lógica: acceso a datos, utilidades puras
types/           → solo tipos: interfaces, enums, constantes
```

**Regla**: Las páginas (`page.tsx`) no contienen lógica de negocio.
Las páginas llaman funciones de `lib/` y pasan los datos a componentes.

```tsx
// ✅ página limpia
export default async function TransactionsPage() {
  const transactions = await getTransactions()
  return <TransactionTable data={transactions} />
}

// ❌ lógica en la página
export default async function TransactionsPage() {
  const res = await fetch('https://sheets.googleapis.com/...')
  const data = await res.json()
  const filtered = data.values.filter(row => row[4] === 'INGRESO')
  ...
}
```

### 3. Acceso a datos solo desde `lib/`

Todo acceso a Google Sheets o APIs externas va en `src/lib/`:

```
src/lib/
  sheets.ts      → funciones para leer/escribir Google Sheets
  drive.ts       → funciones para acceder a archivos de Drive
  auth.ts        → configuración de NextAuth
  utils.ts       → utilidades puras (formateo, fechas, moneda)
  db.ts          → cliente Prisma (inactivo en Fase A, activo en Fase B)
```

Cada función en `lib/sheets.ts` tiene una sola responsabilidad:

```ts
// ✅ funciones pequeñas y específicas
export async function getTransactions(): Promise<Transaction[]> { ... }
export async function getVehicles(): Promise<Vehicle[]> { ... }
export async function addTransaction(data: NewTransaction): Promise<void> { ... }
```

### 4. API Routes para mutaciones

Las operaciones de escritura (POST, PUT, DELETE) van en Route Handlers bajo `app/api/`.
Nunca llamar Google Sheets API directamente desde Client Components.

```
app/api/
  transactions/route.ts    → GET (lista), POST (crear)
  transactions/[id]/route.ts → PUT (editar), DELETE (eliminar)
  vehicles/route.ts
  worked-days/route.ts
  sheets/import/route.ts   → importar datos históricos del Sheet
```

Desde un Client Component:
```tsx
// ✅ llamar la propia API
const res = await fetch('/api/transactions', {
  method: 'POST',
  body: JSON.stringify(data),
})
```

### 5. Manejo de errores consistente

Todas las funciones de `lib/` retornan un resultado tipado, nunca lanzan excepciones sin capturar:

```ts
// Patrón de resultado
type Result<T> = { data: T; error: null } | { data: null; error: string }

export async function getTransactions(): Promise<Result<Transaction[]>> {
  try {
    const data = await fetchFromSheets(...)
    return { data, error: null }
  } catch (e) {
    return { data: null, error: 'No se pudieron cargar las transacciones' }
  }
}
```

En las páginas:
```tsx
export default async function Page() {
  const { data, error } = await getTransactions()
  if (error) return <ErrorMessage message={error} />
  return <TransactionTable data={data} />
}
```

---

## Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # Página de login
│   ├── (dashboard)/
│   │   ├── layout.tsx            # Layout con sidebar + navbar
│   │   ├── page.tsx              # Dashboard principal
│   │   ├── vehicles/
│   │   │   ├── page.tsx          # Lista de vehículos
│   │   │   └── [plate]/
│   │   │       └── page.tsx      # Detalle de vehículo
│   │   ├── transactions/
│   │   │   ├── page.tsx          # Lista de transacciones
│   │   │   └── new/
│   │   │       └── page.tsx      # Formulario nueva transacción
│   │   └── worked-days/
│   │       └── page.tsx          # Matriz de días trabajados
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts          # NextAuth handler
│   │   ├── vehicles/
│   │   │   └── route.ts
│   │   ├── transactions/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── worked-days/
│   │   │   └── route.ts
│   │   └── sheets/
│   │       └── import/route.ts   # Importador histórico
│   ├── layout.tsx                # Root layout
│   └── globals.css
├── components/
│   ├── ui/                       # shadcn/ui (no modificar directamente)
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── MobileNav.tsx
│   ├── dashboard/
│   │   ├── SummaryCard.tsx
│   │   ├── VehicleStatusRow.tsx
│   │   └── AlertBanner.tsx
│   ├── transactions/
│   │   ├── TransactionTable.tsx
│   │   ├── TransactionForm.tsx
│   │   └── TransactionFilters.tsx
│   ├── vehicles/
│   │   ├── VehicleCard.tsx
│   │   └── VehicleDetail.tsx
│   └── worked-days/
│       └── WorkedDaysGrid.tsx
├── lib/
│   ├── sheets.ts                 # Google Sheets API
│   ├── drive.ts                  # Google Drive API
│   ├── auth.ts                   # NextAuth config
│   ├── utils.ts                  # formatCurrency, formatDate, cn()
│   └── db.ts                     # Prisma (Fase B)
├── hooks/
│   └── useMediaQuery.ts          # Responsive helpers
├── types/
│   └── index.ts                  # Todos los tipos del dominio
└── middleware.ts                 # Protección de rutas autenticadas
```

---

## Convenciones de código

### Nombrado

```
Componentes:      PascalCase     → TransactionTable.tsx
Hooks:            camelCase      → useMediaQuery.ts
Utilidades:       camelCase      → formatCurrency()
Tipos/interfaces: PascalCase     → Transaction, Vehicle
Constantes:       UPPER_SNAKE    → VEHICLES_DATA, TRANSACTION_SUBTYPES
Rutas API:        kebab-case     → /api/worked-days
Variables:        camelCase      → vehiclePlate, pendingAmount
```

### Componentes

```tsx
// Estructura estándar de un componente
interface Props {
  vehicles: Vehicle[]
  onSelect?: (vehicle: Vehicle) => void
}

export function VehicleCard({ vehicles, onSelect }: Props) {
  // 1. hooks
  // 2. lógica derivada (sin efectos secundarios)
  // 3. handlers
  // 4. return JSX
}
```

- Props siempre tipadas con `interface Props` local
- No usar `React.FC` ni `FC<Props>` — usar funciones normales
- No exportar `default` en componentes reutilizables — usar named exports
- Las páginas (`page.tsx`) sí usan `export default`

### TypeScript

```ts
// ✅ tipos explícitos en funciones públicas
async function getTransactions(): Promise<Transaction[]>

// ✅ no usar `any`
// ❌ const data: any = await fetch(...)

// ✅ usar tipos del dominio definidos en types/index.ts
// ❌ no redefinir tipos inline en componentes

// ✅ optional chaining y nullish coalescing
const km = vehicle.currentKm ?? 'Sin registro'
const alias = vehicle?.alias ?? vehicle.plate
```

### Moneda y fechas (Colombia)

Siempre usar las funciones de `lib/utils.ts`:

```ts
formatCurrency(270000)  // → "$270.000"
formatDate('2026-04-17') // → "17 abr 2026"
formatDateShort('2026-04-17') // → "17/04/26"
```

---

## Variables de entorno

```
.env.local          → desarrollo local (nunca subir a git)
.env.production     → producción (configurar en Railway/Vercel)
```

Todas las variables se validan en `src/lib/env.ts` al arrancar.
Si falta una variable crítica, la app falla explícitamente en desarrollo.

```ts
// src/lib/env.ts
export const env = {
  NEXTAUTH_SECRET:   required('NEXTAUTH_SECRET'),
  SHEETS_ID:         required('GOOGLE_SHEETS_ID'),
  // ...
}

function required(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Variable de entorno faltante: ${key}`)
  return val
}
```

---

## Autenticación

- NextAuth.js con `CredentialsProvider`
- 2 usuarios hardcodeados en Fase A (dueño + admin)
- Sesión persistente con JWT (no base de datos en Fase A)
- Middleware protege todas las rutas bajo `/(dashboard)`
- El rol (`OWNER` / `ADMIN`) viaja en el JWT y controla qué ve cada usuario

---

## Google Sheets — capa de datos (Fase A)

Estructura del Sheet `Carros.xlsx`:
- Hoja `BASE DE DATOS PRINCIPAL`: transacciones históricas
- Hoja `Matriz de dias trabajados`: asistencia diaria por carro

Convenciones:
- Leer en modo append: nunca sobreescribir filas existentes
- Nuevos registros siempre al final de la hoja
- Los IDs de fila del Sheet se usan como ID temporal hasta migrar a PostgreSQL
- Cache de 60 segundos en lecturas frecuentes (evitar rate limit de Sheets API)

---

## Git workflow

```
main          → producción (protegida)
develop       → integración
feature/xxx   → nueva funcionalidad
fix/xxx       → corrección de bug
```

Commits en español, formato imperativo:
```
✅ "Agregar formulario de nueva transacción"
✅ "Corregir cálculo de balance mensual"
✅ "Conectar Google Sheets API con autenticación"
❌ "fixed stuff"
❌ "changes"
```

---

## Checklist antes de cada PR

- [ ] No hay `console.log` en el código
- [ ] No hay `any` en TypeScript
- [ ] Los formularios validan los campos requeridos
- [ ] Los errores muestran mensaje al usuario (no solo en consola)
- [ ] Los montos usan `formatCurrency()` al mostrar
- [ ] Las fechas usan `formatDate()` al mostrar
- [ ] La vista se ve bien en móvil (Sara usa el celular)
- [ ] No se subieron archivos `.env` al commit

---

## Fase B — Migración a PostgreSQL

Cuando la app esté estable:
1. Activar `src/lib/db.ts` (cliente Prisma)
2. Levantar PostgreSQL en Railway
3. Correr `npm run migrate:from-sheets` (script a escribir)
4. Cambiar funciones de `lib/sheets.ts` a `lib/db.ts` una por una
5. Verificar paridad de datos entre Sheet y PostgreSQL
6. El Sheet queda como respaldo de solo lectura

El modelo Prisma ya está definido en `prisma/schema.prisma` desde el inicio
para no tener que diseñarlo después bajo presión.
