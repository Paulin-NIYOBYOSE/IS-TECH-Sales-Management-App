'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker, DayPickerProps } from 'react-day-picker';
import { cn } from '@/lib/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="rounded-xl border bg-white shadow-lg p-4 w-fit">
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("w-fit", className)}
        classNames={{
          months: "flex flex-col",
          month: "space-y-4",
          caption: "flex justify-between items-center px-2",
          caption_label: "text-lg font-semibold text-gray-800",
          nav: "flex items-center gap-4",
          nav_button: "p-2 rounded-full hover:bg-gray-100 transition",
          table: "w-full border-collapse",
          head_row: "flex justify-between text-gray-500 text-sm",
          head_cell: "w-9 text-center font-medium",
          row: "flex justify-between",
          cell: cn(
            "relative w-9 h-9 text-center text-sm",
            "aria-disabled:opacity-50 aria-disabled:pointer-events-none"
          ),
          day: cn(
            "w-full h-full rounded-md border hover:bg-gray-100 transition",
            "aria-selected:bg-orange-500 aria-selected:text-white"
          ),
          day_today: "border-2 border-orange-400",
          day_selected: "bg-orange-500 text-white hover:bg-orange-600",
          day_outside: "text-gray-400",
          day_disabled: "text-gray-300 opacity-50",
          ...classNames,
        }}
        components={{
          Chevron: ({ orientation }) =>
            orientation === 'left' ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            ),
        }}
        {...props}
      />
      <div className="mt-4 flex justify-between px-2">
        <button className="px-4 py-2 rounded-full border text-gray-700 hover:bg-gray-100 transition">
          Cancel
        </button>
        <button className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition">
          Apply
        </button>
      </div>
    </div>
  );
}
