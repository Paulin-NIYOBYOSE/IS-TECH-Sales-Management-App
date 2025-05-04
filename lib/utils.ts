import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format currency in Rwandan Francs
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-RW", {
    style: "currency",
    currency: "RWF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Format date to readable string
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date))
}

// Get date range for queries
export function getDateRangeQuery(from?: Date, to?: Date): { query: string; params: any[] } {
  if (!from && !to) {
    return { query: "", params: [] }
  }

  if (from && to) {
    return {
      query: "AND date BETWEEN $1 AND $2",
      params: [from.toISOString().split("T")[0], to.toISOString().split("T")[0]],
    }
  }

  if (from) {
    return {
      query: "AND date >= $1",
      params: [from.toISOString().split("T")[0]],
    }
  }

  return {
    query: "AND date <= $1",
    params: [to!.toISOString().split("T")[0]],
  }
}

// Get previous period for comparison
export function getPreviousPeriod(from: Date, to: Date): { from: Date; to: Date } {
  const diffTime = Math.abs(to.getTime() - from.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const previousFrom = new Date(from)
  previousFrom.setDate(previousFrom.getDate() - diffDays)

  const previousTo = new Date(to)
  previousTo.setDate(previousTo.getDate() - diffDays)

  return { from: previousFrom, to: previousTo }
}

// Get month name
export function getMonthName(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date)
}

// Generate empty state message
export function getEmptyStateMessage(itemType: string): string {
  return `No ${itemType} found. Add some ${itemType} to get started.`
}
