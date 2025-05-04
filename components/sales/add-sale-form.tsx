"use client"

import { useState, useRef, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { addSale, getProducts } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import type { Product } from "@/lib/actions"

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  productId: z.string().min(1, {
    message: "Please select a product.",
  }),
  quantity: z.coerce.number().int().positive({
    message: "Quantity must be a positive integer.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  saleDate: z.date(),
  paymentStatus: z.string().min(1, {
    message: "Please select a payment status.",
  }),
  dueDate: z.date().optional(),
})

interface AddSaleFormProps {
  onSaleAdded: () => void
}

export function AddSaleForm({ onSaleAdded }: AddSaleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [dueDateCalendarOpen, setDueDateCalendarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [costPrice, setCostPrice] = useState<number>(0)
  const [profit, setProfit] = useState<number>(0)

  const calendarTriggerRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)
  const dueDateCalendarTriggerRef = useRef<HTMLButtonElement>(null)
  const dueDateCalendarRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      productId: "",
      quantity: 1,
      amount: 0,
      saleDate: new Date(),
      paymentStatus: "paid",
    },
  })

  // Fetch products on component mount
  useEffect(() => {
    async function fetchProducts() {
      const productsData = await getProducts()
      setProducts(productsData)
    }
    fetchProducts()
  }, [])

  // Update amount and profit calculations when product or quantity changes
  useEffect(() => {
    const productId = form.watch("productId")
    const quantity = form.watch("quantity")
    const amount = form.watch("amount")

    if (productId && quantity) {
      const product = products.find((p) => p.id.toString() === productId)
      if (product) {
        setSelectedProduct(product)
        const newCostPrice = product.unit_price * quantity
        setCostPrice(newCostPrice)

        // Calculate profit based on selling price - cost price
        const newProfit = amount - newCostPrice
        setProfit(newProfit)
      }
    }
  }, [form.watch("productId"), form.watch("quantity"), form.watch("amount"), products, form])

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node) &&
        calendarTriggerRef.current &&
        !calendarTriggerRef.current.contains(event.target as Node)
      ) {
        setCalendarOpen(false)
      }

      if (
        dueDateCalendarOpen &&
        dueDateCalendarRef.current &&
        !dueDateCalendarRef.current.contains(event.target as Node) &&
        dueDateCalendarTriggerRef.current &&
        !dueDateCalendarTriggerRef.current.contains(event.target as Node)
      ) {
        setDueDateCalendarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [calendarOpen, dueDateCalendarOpen])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Validate that selling price is greater than cost price
    if (values.amount <= costPrice) {
      toast({
        title: "Invalid selling price",
        description: "Selling price must be greater than the cost price to make a profit",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("customerName", values.customerName)
    formData.append("productId", values.productId)
    formData.append("quantity", values.quantity.toString())
    formData.append("amount", values.amount.toString())
    formData.append("saleDate", values.saleDate.toISOString())
    formData.append("paymentStatus", values.paymentStatus)

    if (values.paymentStatus !== "paid" && values.dueDate) {
      formData.append("dueDate", values.dueDate.toISOString())
    } else if (values.paymentStatus !== "paid") {
      // Default due date to 30 days from sale date if not provided
      const dueDate = new Date(values.saleDate)
      dueDate.setDate(dueDate.getDate() + 30)
      formData.append("dueDate", dueDate.toISOString())
    }

    const result = await addSale(formData)

    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Sale recorded successfully",
        description: `${values.quantity} ${selectedProduct?.name || "items"} sold to ${values.customerName}`,
        variant: "default",
        className: "bg-[var(--success)] text-white",
      })
      form.reset()
      onSaleAdded()
    } else {
      toast({
        title: "Error recording sale",
        description: result.error || "Failed to record sale",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="card-hover card-primary">
      <CardHeader className="bg-muted/20">
        <CardTitle>Record New Sale</CardTitle>
        <CardDescription>Add a new sales transaction</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {products.length > 0 ? (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id.toString()}>
                            {product.name} (Cost: {formatCurrency(product.unit_price)})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-products" disabled>
                          No products available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price (RWF)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="1"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          const newAmount = Number.parseFloat(e.target.value)
                          setProfit(newAmount - costPrice)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedProduct && (
              <div className="grid grid-cols-2 gap-4 p-3 bg-muted/20 rounded-md">
                <div>
                  <p className="text-xs text-muted-foreground">Cost Price</p>
                  <p className="font-medium">{formatCurrency(costPrice)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expected Profit</p>
                  <p className={`font-medium ${profit >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                    {formatCurrency(profit)}
                  </p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="saleDate"
              render={({ field }) => (
                <FormItem className="flex flex-col relative">
                  <FormLabel>Sale Date</FormLabel>
                  <Button
                    ref={calendarTriggerRef}
                    type="button"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                  </Button>

                  {calendarOpen && (
                    <div
                      ref={calendarRef}
                      className="absolute left-0 top-full mt-2 z-[9999] bg-popover p-4 rounded-md border shadow-md"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date)
                          setCalendarOpen(false)
                        }}
                        initialFocus
                        className="rounded-md border-0"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid" className="text-[var(--success)]">
                        Paid
                      </SelectItem>
                      <SelectItem value="pending" className="text-[var(--warning)]">
                        Pending
                      </SelectItem>
                      <SelectItem value="partial" className="text-[var(--info)]">
                        Partial Payment
                      </SelectItem>
                      <SelectItem value="overdue" className="text-[var(--danger)]">
                        Overdue
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("paymentStatus") !== "paid" && (
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col relative">
                    <FormLabel>Payment Due Date</FormLabel>
                    <Button
                      ref={dueDateCalendarTriggerRef}
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      onClick={() => setDueDateCalendarOpen(!dueDateCalendarOpen)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a due date</span>}
                    </Button>

                    {dueDateCalendarOpen && (
                      <div
                        ref={dueDateCalendarRef}
                        className="absolute left-0 top-full mt-2 z-[9999] bg-popover p-4 rounded-md border shadow-md"
                      >
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date)
                            setDueDateCalendarOpen(false)
                          }}
                          initialFocus
                          className="rounded-md border-0"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" className="w-full bg-[var(--primary)]" disabled={isSubmitting}>
              {isSubmitting ? "Recording Sale..." : "Record Sale"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
