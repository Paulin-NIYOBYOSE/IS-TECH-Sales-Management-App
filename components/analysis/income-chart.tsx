"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import type { ChartData } from "@/lib/actions"

interface IncomeChartProps {
  data: ChartData[]
  isLoading: boolean
}

export function IncomeChart({ data, isLoading }: IncomeChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40 mb-1" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle>Income & Profit Trend</CardTitle>
        <CardDescription>Income and profit over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                <XAxis dataKey="name" stroke={isDark ? "#888" : "#666"} />
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
                <Line
                  type="monotone"
                  dataKey="sales"
                  name="Income"
                  stroke="var(--chart-1)"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  name="Profit"
                  stroke="var(--chart-3)"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
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
