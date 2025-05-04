"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getRecentDebtors } from "@/lib/actions"
import { formatCurrency, formatDate } from "@/lib/utils"
import type { Debtor } from "@/lib/actions"

export function RecentDebtors() {
  const [debtors, setDebtors] = useState<Debtor[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDebtors() {
      setIsLoading(true)
      const data = await getRecentDebtors()
      setDebtors(data)
      setIsLoading(false)
    }

    fetchDebtors()
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Debtors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto mt-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Debtors</CardTitle>
      </CardHeader>
      <CardContent>
        {debtors.length > 0 ? (
          <div className="space-y-4">
            {debtors.map((debtor) => (
              <div key={debtor.id} className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{debtor.customer_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{debtor.customer_name}</p>
                    <Badge
                      variant="outline"
                      className={
                        debtor.status === "paid"
                          ? "text-emerald-500 border-emerald-500"
                          : debtor.status === "partial"
                            ? "text-amber-500 border-amber-500"
                            : "text-rose-500 border-rose-500"
                      }
                    >
                      {debtor.status.charAt(0).toUpperCase() + debtor.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{debtor.product}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatCurrency(debtor.amount)}</p>
                  <p className="text-xs text-muted-foreground">Due: {formatDate(debtor.due_date)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-muted-foreground">
            <p>No active debtors found</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
