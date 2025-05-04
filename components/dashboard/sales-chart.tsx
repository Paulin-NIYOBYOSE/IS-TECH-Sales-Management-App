"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getChartData } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import type { ChartData } from "@/lib/actions"
import type { DateRange } from "react-day-picker"

interface SalesChartProps {
  dateRange: DateRange | undefined
}

export function SalesChart({ dateRange }: SalesChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day")

  useEffect(() => {
    async function fetchChartData() {
      setIsLoading(true)
      const data = await getChartData(dateRange?.from, dateRange?.to, groupBy)
      setChartData(data)
      setIsLoading(false)
    }

    fetchChartData()
  }, [dateRange, groupBy])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Comparison of sales and expenses over time</CardDescription>
          </div>
          <Skeleton className="h-9 w-[120px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Comparison of sales, expenses, and profit over time</CardDescription>
        </div>
        <Select value={groupBy} onValueChange={(value) => setGroupBy(value as "day" | "week" | "month")}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Daily</SelectItem>
            <SelectItem value="week">Weekly</SelectItem>
            <SelectItem value="month">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                <XAxis dataKey="name" stroke={isDark ? "#888" : "#666"} />
                <YAxis stroke={isDark ? "#888" : "#666"} />
                <YAxis stroke={isDark ? "#888" : "#666"} tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value as number), ""]}
                  contentStyle={{
                    backgroundColor: isDark ? "#333" : "#fff",
                    color: isDark ? "#fff" : "#333",
                    border: isDark ? "1px solid #444" : "1px solid #ddd",
                  }}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No data available for the selected period</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
