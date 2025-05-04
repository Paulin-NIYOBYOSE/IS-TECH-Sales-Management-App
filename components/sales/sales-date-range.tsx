"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

interface SalesDateRangeProps {
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
}

export function SalesDateRange({ dateRange, onDateRangeChange }: SalesDateRangeProps) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

  return (
    <Card className="card-primary">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 relative">
          <Button
            ref={triggerRef}
            variant="outline"
            className="w-full justify-start text-left sm:w-auto"
            onClick={() => setOpen(!open)}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[var(--primary)]" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>

          {open && (
            <div
              ref={calendarRef}
              className="absolute left-0 top-full mt-2 z-[999] bg-popover p-4 rounded-md border shadow-md"
              style={{ minWidth: "500px" }}
            >
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={(range) => {
                  onDateRangeChange(range)
                  if (range?.from && range?.to) {
                    setOpen(false)
                  }
                }}
                numberOfMonths={2}
                className="rounded-md border-0"
              />
            </div>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          {dateRange?.from && dateRange?.to
            ? `Showing sales from ${format(dateRange.from, "MMMM d, yyyy")} to ${format(dateRange.to, "MMMM d, yyyy")}`
            : "Select a date range to view sales"}
        </div>
      </CardContent>
    </Card>
  )
}
