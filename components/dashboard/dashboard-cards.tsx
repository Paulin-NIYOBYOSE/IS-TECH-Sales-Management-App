"use client"

import { ArrowDownIcon, ArrowUpIcon, DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import type { DashboardStats } from "@/lib/actions"

interface DashboardCardsProps {
  stats: DashboardStats | null
  isLoading: boolean
}

export function DashboardCards({ stats, isLoading }: DashboardCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="col-span-full p-6 text-center">
          <p className="text-muted-foreground">No data available. Please select a date range.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {stats.revenueChange > 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-rose-500" />
            )}
            <span className={stats.revenueChange > 0 ? "text-emerald-500" : "text-rose-500"}>
              {stats.revenueChange.toFixed(1)}%
            </span>
            <span className="ml-1">from previous period</span>  
          </div>
        </CardContent>
      </Card>
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalExpenses)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {stats.expensesChange > 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-rose-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-emerald-500" />
            )}
            <span className={stats.expensesChange > 0 ? "text-rose-500" : "text-emerald-500"}>
              {Math.abs(stats.expensesChange).toFixed(1)}%
            </span>
            <span className="ml-1">from previous period</span>
          </div>
        </CardContent>
      </Card>
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Products Sold</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.productsSold}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {stats.productsSoldChange > 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-rose-500" />
            )}
            <span className={stats.productsSoldChange > 0 ? "text-emerald-500" : "text-rose-500"}>
              {stats.productsSoldChange.toFixed(1)}%
            </span>
            <span className="ml-1">from previous period</span>
          </div>
        </CardContent>
      </Card>
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Debtors</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeDebtors}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {stats.debtorsChange > 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4 text-rose-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4 text-emerald-500" />
            )}
            <span className={stats.debtorsChange > 0 ? "text-rose-500" : "text-emerald-500"}>
              {Math.abs(stats.debtorsChange).toFixed(1)}%
            </span>
            <span className="ml-1">from previous period</span>
          </div>
        </CardContent>
      </Card>
      <Card className="card-hover gradient-primary text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-white">Total Profit</CardTitle>
          <TrendingUp className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalProfit)}</div>
          <div className="flex items-center text-xs text-white/80">
            {stats.profitChange > 0 ? (
              <ArrowUpIcon className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownIcon className="mr-1 h-4 w-4" />
            )}
            <span>{stats.profitChange.toFixed(1)}%</span>
            <span className="ml-1">from previous period</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
