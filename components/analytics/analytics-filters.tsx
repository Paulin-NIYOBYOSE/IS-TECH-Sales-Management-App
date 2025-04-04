"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download } from "lucide-react"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

export function AnalyticsFilters() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  const [productCategory, setProductCategory] = useState<string>("all")

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button id="date" variant={"outline"} className="w-full justify-start text-left sm:w-[300px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        <Select value={productCategory} onValueChange={setProductCategory}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Product Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="smartphones">Smartphones</SelectItem>
            <SelectItem value="laptops">Laptops</SelectItem>
            <SelectItem value="audio">Audio Devices</SelectItem>
            <SelectItem value="wearables">Wearables</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="gap-2">
        <Download className="h-4 w-4" />
        Export Report
      </Button>
    </div>
  )
}

