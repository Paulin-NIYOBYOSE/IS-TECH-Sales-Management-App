"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { ArrowUpDown, Check, Search, AlertTriangle } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import { updateSaleStatus } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import type { Sale } from "@/lib/actions"

interface SalesTableProps {
  sales: Sale[]
  isLoading: boolean
  onSaleUpdated: () => void
}

export function SalesTable({ sales, isLoading, onSaleUpdated }: SalesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "sale_date", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [processingId, setProcessingId] = useState<number | null>(null)

  async function handleMarkAsPaid(id: number) {
    setProcessingId(id)
    const result = await updateSaleStatus(id, "paid")

    if (result.success) {
      toast({
        title: "Payment recorded",
        description: "The sale has been marked as paid.",
        className: "bg-[var(--success)] text-white",
      })
      onSaleUpdated()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update sale status",
        variant: "destructive",
      })
    }

    setProcessingId(null)
  }

  async function handleMarkAsOverdue(id: number) {
    setProcessingId(id)
    const result = await updateSaleStatus(id, "overdue")

    if (result.success) {
      toast({
        title: "Sale marked as overdue",
        description: "The sale has been marked as overdue.",
        className: "bg-[var(--warning)] text-white",
      })
      onSaleUpdated()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update sale status",
        variant: "destructive",
      })
    }

    setProcessingId(null)
  }

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "customer_name",
      header: "Customer",
      cell: ({ row }) => <div className="font-medium">{row.getValue("customer_name")}</div>,
    },
    {
      accessorKey: "product_name",
      header: "Product",
      cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
    },
    {
      accessorKey: "quantity",
      header: "Qty",
      cell: ({ row }) => <div className="text-center">{row.getValue("quantity")}</div>,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        return <div className="text-right font-medium">{formatCurrency(amount)}</div>
      },
    },
    {
      accessorKey: "sale_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => format(new Date(row.getValue("sale_date")), "MMM d, yyyy"),
    },
    {
      accessorKey: "payment_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("payment_status") as string
        return (
          <Badge
            variant="outline"
            className={
              status === "paid"
                ? "status-paid"
                : status === "partial"
                  ? "status-partial"
                  : status === "overdue"
                    ? "status-overdue"
                    : "status-pending"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sale = row.original
        return (
          <div className="flex justify-end gap-2">
            {sale.payment_status !== "paid" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMarkAsPaid(sale.id)}
                disabled={processingId === sale.id}
                className="h-8 w-8 text-[var(--success)] hover:text-[var(--success)] hover:bg-[var(--success)]/10"
                title="Mark as paid"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            {sale.payment_status === "pending" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMarkAsOverdue(sale.id)}
                disabled={processingId === sale.id}
                className="h-8 w-8 text-[var(--warning)] hover:text-[var(--warning)] hover:bg-[var(--warning)]/10"
                title="Mark as overdue"
              >
                <AlertTriangle className="h-4 w-4" />
              </Button>
            )}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: sales,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Transactions</CardTitle>
          <Skeleton className="h-10 w-64" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, i) => (
                    <TableHead key={i}>
                      <Skeleton className="h-4 w-20" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: columns.length }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover card-secondary">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/20">
        <CardTitle>Sales Transactions</CardTitle>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search sales..."
            className="pl-8"
            value={(table.getColumn("customer_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("customer_name")?.setFilterValue(event.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-md border">
          <Table className="table-row-alternate table-hover">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No sales found for the selected period.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
