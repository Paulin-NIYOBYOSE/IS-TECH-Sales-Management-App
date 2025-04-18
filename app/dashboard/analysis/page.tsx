"use client"

import { useState, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { AnalysisHeader } from "@/components/analysis/analysis-header"
import { AnalysisDateRange } from "@/components/analysis/analysis-date-range"
import { AnalysisCards } from "@/components/analysis/analysis-cards"
import { ExpensesChart } from "@/components/analysis/expenses-chart"
import { IncomeChart } from "@/components/analysis/income-chart"
import { getDashboardStats, getChartData } from "@/lib/actions"
import type { DashboardStats, ChartData } from "@/lib/actions"

export default function AnalysisPage() {
  // Default to current month
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: firstDayOfMonth,
    to: lastDayOfMonth,
  })

  const [period, setPeriod] = useState("daily")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [expensesData, setExpensesData] = useState<ChartData[]>([])
  const [incomeData, setIncomeData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (dateRange?.from && dateRange?.to) {
        setIsLoading(true)

        const statsData = await getDashboardStats(dateRange.from, dateRange.to)
        setStats(statsData)

        const chartPeriod = period === "daily" ? "day" : period === "weekly" ? "week" : "month"
        const chartData = await getChartData(dateRange.from, dateRange.to, chartPeriod as any)

        setExpensesData(chartData)
        setIncomeData(chartData)

        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange, period])

  return (
    <div className="flex flex-col gap-6">
      <AnalysisHeader />
      <AnalysisDateRange
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        period={period}
        onPeriodChange={setPeriod}
      />
      <AnalysisCards stats={stats} isLoading={isLoading} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ExpensesChart data={expensesData} isLoading={isLoading} />
        <IncomeChart data={incomeData} isLoading={isLoading} />
      </div>
    </div>
  )
}
