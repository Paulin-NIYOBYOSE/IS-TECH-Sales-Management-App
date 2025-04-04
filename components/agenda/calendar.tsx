"use client"

import { useState } from "react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CalendarProps {
  className?: string
}

export function Calendar({ className }: CalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Sample events data - in a real app, this would come from your database
  const events = [
    { date: new Date(2023, 3, 12), title: "Supplier Meeting" },
    { date: new Date(2023, 3, 15), title: "Inventory Check" },
    { date: new Date(2023, 3, 18), title: "Marketing Campaign Launch" },
    { date: new Date(2023, 3, 22), title: "Staff Training" },
    { date: new Date(2023, 3, 25), title: "Product Launch" },
  ]

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          modifiers={{
            booked: events.map((event) => event.date),
          }}
          modifiersStyles={{
            booked: {
              backgroundColor: "hsl(var(--primary) / 0.1)",
              color: "hsl(var(--primary))",
              fontWeight: "bold",
            },
          }}
        />
      </CardContent>
    </Card>
  )
}

