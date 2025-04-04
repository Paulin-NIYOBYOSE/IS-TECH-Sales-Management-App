"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesChartProps {
  className?: string
}

export function SalesChart({ className }: SalesChartProps) {
  const { theme } = useTheme()

  const data = [
    {
      name: "Jan",
      total: 1800,
    },
    {
      name: "Feb",
      total: 2200,
    },
    {
      name: "Mar",
      total: 2800,
    },
    {
      name: "Apr",
      total: 2400,
    },
    {
      name: "May",
      total: 2900,
    },
    {
      name: "Jun",
      total: 3200,
    },
    {
      name: "Jul",
      total: 3800,
    },
    {
      name: "Aug",
      total: 4000,
    },
    {
      name: "Sep",
      total: 3700,
    },
    {
      name: "Oct",
      total: 4200,
    },
    {
      name: "Nov",
      total: 4800,
    },
    {
      name: "Dec",
      total: 5200,
    },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
        <CardDescription>Monthly sales performance for the current year</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                background: theme === "dark" ? "#1f2937" : "#ffffff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number) => [`$${value}`, "Revenue"]}
            />
            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

