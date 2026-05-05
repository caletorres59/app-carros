import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formatea montos en pesos colombianos: 270000 → "$270.000"
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Formatea fecha larga: "2026-04-17" → "17 abr 2026"
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'America/Bogota',
  }).format(new Date(date))
}

// Formatea fecha corta: "2026-04-17" → "17/04/26"
export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'America/Bogota',
  }).format(new Date(date))
}

// Nombre del mes en español: 4 → "Abril"
export function getMonthName(month: number): string {
  return new Intl.DateTimeFormat('es-CO', { month: 'long' }).format(
    new Date(2026, month - 1, 1)
  )
}

// Parsea monto desde string del Sheet: " $270,000 " → 270000
export function parseCurrencyFromSheet(value: string): number {
  if (!value) return 0
  return parseInt(value.replace(/[$,.\s]/g, '').replace(/\./g, ''), 10) || 0
}

// Parsea fecha desde el Sheet: "4/17/2026" → "2026-04-17"
export function parseDateFromSheet(value: string): string {
  if (!value) return ''
  const [month, day, year] = value.split('/')
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

// Días hasta una fecha (para alertas de vencimiento)
export function daysUntil(date: string | Date): number {
  const target = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}
