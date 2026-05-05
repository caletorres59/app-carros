export type VehicleStatus = 'ACTIVE' | 'WORKSHOP' | 'INACTIVE'
export type TransactionType = 'INCOME' | 'EXPENSE' | 'MAINTENANCE'
export type WorkedDayStatus = 'WORKED' | 'NOT_WORKED' | 'WORKSHOP'
export type UserRole = 'OWNER' | 'ADMIN'

export interface Vehicle {
  id: string
  plate: string
  alias: string
  brand: string
  model: string
  year?: number
  color: string
  status: VehicleStatus
  currentKm?: number
  driverId?: string
  soatExpiry?: string
  tecnoExpiry?: string
  photoUrl?: string
  notes?: string
}

export interface Driver {
  id: string
  name: string
  document?: string
  phone?: string
  vehicleId?: string
  status: 'ACTIVE' | 'INACTIVE'
}

export interface Transaction {
  id: string
  vehicleId: string
  vehiclePlate?: string
  vehicleAlias?: string
  date: string
  km?: number
  type: TransactionType
  subtype?: string
  amount: number
  pendingAmount?: number
  notes?: string
  invoiceUrl?: string
  createdBy?: string
}

export interface WorkedDay {
  id: string
  vehicleId: string
  date: string
  status: WorkedDayStatus
  notes?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

// Datos reales del negocio
export const VEHICLES_DATA: Omit<Vehicle, 'id'>[] = [
  { plate: 'BCP-242', alias: 'VINOTINTO', brand: 'Renault', model: 'Symbol', color: 'Vinotinto', status: 'ACTIVE', currentKm: 217463 },
  { plate: 'BOV-856', alias: 'AZUL',      brand: 'Renault', model: 'Symbol', color: 'Azul',      status: 'ACTIVE' },
  { plate: 'BYK-745', alias: 'PROFE',     brand: 'Renault', model: 'Symbol', color: 'Gris',      status: 'ACTIVE', currentKm: 133393 },
  { plate: 'CVD-343', alias: 'RAUL',      brand: 'Chevrolet', model: 'Aveo', color: 'Gris',      status: 'ACTIVE', currentKm: 197530 },
  { plate: 'BPN-190', alias: 'POLO',      brand: 'Volkswagen', model: 'Polo', color: 'Blanco',   status: 'ACTIVE' },
]

export const TRANSACTION_SUBTYPES = {
  INCOME:      ['Cuota semanal', 'Cuota quincenal', 'Abono', 'Depósito', 'Otro'],
  EXPENSE:     ['Seguro todo riesgo', 'SOAT', 'Parqueadero', 'Combustible', 'Otro'],
  MAINTENANCE: ['Cambio de aceite', 'Llantas', 'Frenos', 'Suspensión', 'Correa distribución', 'Eléctrico', 'Revisión tecnomecánica', 'Lavada', 'Otro'],
}
