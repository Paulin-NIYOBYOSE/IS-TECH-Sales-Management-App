"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardCards } from "@/components/dashboard/dashboard-cards"
import { RecentSales } from "@/components/dashboard/recent-sales"
import { RecentDebtors } from "@/components/dashboard/recent-debtors"
import { SalesChart } from "@/components/dashboard/sales-chart"
import { getDashboardStats } from "@/lib/actions"
import type { DashboardStats } from "@/lib/actions"

export default function DashboardPage() {
  // Default to current month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  })

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      if (dateRange?.from && dateRange?.to) {
        setIsLoading(true)
        const data = await getDashboardStats(dateRange.from, dateRange.to)
        setStats(data)
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [dateRange])

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
      <DashboardCards stats={stats} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesChart dateRange={dateRange} />
        <div className="flex flex-col gap-6">
          <RecentSales />
          <RecentDebtors />
        </div>
      </div>
    </div>
  )
}
