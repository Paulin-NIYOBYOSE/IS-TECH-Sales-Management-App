"use client"

import { useTheme } from "next-themes"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MonthlySalesChart() {
  const { theme } = useTheme()

  const data = [
    { name: "Jan", sales: 1200 },
    { name: "Feb", sales: 1800 },
    { name: "Mar", sales: 2200 },
    { name: "Apr", sales: 1800 },
    { name: "May", sales: 2400 },
    { name: "Jun", sales: 2800 },
    { name: "Jul", sales: 3200 },
    { name: "Aug", sales: 3600 },
    { name: "Sep", sales: 3200 },
    { name: "Oct", sales: 3800 },
    { name: "Nov", sales: 4200 },
    { name: "Dec", sales: 4800 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
        <CardDescription>Monthly sales performance for the current year</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                background: theme === "dark" ? "#1f2937" : "#ffffff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`$${value}`, "Sales"]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

