"use client"

import { DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import type { DashboardStats } from "@/lib/actions"

interface AnalysisCardsProps {
  stats: DashboardStats | null
  isLoading: boolean
}

export function AnalysisCards({ stats, isLoading }: AnalysisCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <div className="mt-1 grid grid-cols-3 gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j}>
                    <Skeleton className="h-3 w-16 mb-1" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full p-6 text-center">
          <p className="text-muted-foreground">No data available. Please select a date range.</p>
        </Card>
      </div>
    )
  }

  // Calculate weekly, monthly, and annual projections
  const weeklyExpenses = stats.totalExpenses / 4 // Assuming 4 weeks in a month
  const monthlyExpenses = stats.totalExpenses
  const annualExpenses = stats.totalExpenses * 12

  const weeklyIncome = stats.totalRevenue / 4
  const monthlyIncome = stats.totalRevenue
  const annualIncome = stats.totalRevenue * 12

  const weeklyProfit = stats.totalProfit / 4
  const monthlyProfit = stats.totalProfit
  const annualProfit = stats.totalProfit * 12

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
          <div className="mt-1 grid grid-cols-3 text-xs">
            <div>
              <p className="text-muted-foreground">Weekly</p>
              <p className="font-medium">{formatCurrency(weeklyExpenses)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly</p>
              <p className="font-medium">{formatCurrency(monthlyExpenses)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Annually</p>
              <p className="font-medium">{formatCurrency(annualExpenses)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          <div className="mt-1 grid grid-cols-3 text-xs">
            <div>
              <p className="text-muted-foreground">Weekly</p>
              <p className="font-medium">{formatCurrency(weeklyIncome)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Monthly</p>
              <p className="font-medium">{formatCurrency(monthlyIncome)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Annually</p>
              <p className="font-medium">{formatCurrency(annualIncome)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="card-hover gradient-primary text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white">Net Profit</CardTitle>
          <DollarSign className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalProfit)}</div>
          <div className="mt-1 grid grid-cols-3 text-xs text-white/80">
            <div>
              <p>Weekly</p>
              <p className="font-medium">{formatCurrency(weeklyProfit)}</p>
            </div>
            <div>
              <p>Monthly</p>
              <p className="font-medium">{formatCurrency(monthlyProfit)}</p>
            </div>
            <div>
              <p>Annually</p>
              <p className="font-medium">{formatCurrency(annualProfit)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
