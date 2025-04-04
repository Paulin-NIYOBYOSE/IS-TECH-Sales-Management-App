"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function YearlySalesChart() {
  const { theme } = useTheme()

  const data = [
    { name: "2018", sales: 18000 },
    { name: "2019", sales: 24000 },
    { name: "2020", sales: 22000 },
    { name: "2021", sales: 32000 },
    { name: "2022", sales: 40000 },
    { name: "2023", sales: 48000 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Sales</CardTitle>
        <CardDescription>Year-over-year sales performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
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
              formatter={(value: number) => [`$${value}`, "Sales"]}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

