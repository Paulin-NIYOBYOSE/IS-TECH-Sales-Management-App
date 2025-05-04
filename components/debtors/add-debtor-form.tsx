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
import { addDebtor, getProducts } from "@/lib/actions"
import type { Product } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  productId: z.string().min(1, {
    message: "Please select a product.",
  }),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number.",
  }),
  dueDate: z.date(),
})

export function AddDebtorForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const calendarTriggerRef = useRef<HTMLButtonElement>(null)
  const calendarRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      productId: "",
      amount: 0,
      dueDate: new Date(),
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

  // Update amount when product changes
  useEffect(() => {
    const productId = form.watch("productId")

    if (productId) {
      const product = products.find((p) => p.id.toString() === productId)
      if (product) {
        setSelectedProduct(product)
        form.setValue("amount", product.unit_price)
      }
    }
  }, [form.watch("productId"), products, form])

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
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [calendarOpen])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("name", values.name)

    // Get product name and details
    const product = products.find((p) => p.id.toString() === values.productId)
    const productName = product ? `${product.name}` : "Unknown Product"

    formData.append("product", productName)
    formData.append("amount", values.amount.toString())
    formData.append("dueDate", values.dueDate.toISOString())

    const result = await addDebtor(formData)

    setIsSubmitting(false)

    if (result.success) {
      toast({
        title: "Debtor added successfully",
        description: `Added ${values.name} with debt of ${formatCurrency(values.amount)} due on ${format(values.dueDate, "PPP")}`,
        className: "bg-[var(--success)] text-white",
      })
      form.reset()
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add debtor",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="card-hover card-warning">
      <CardHeader className="bg-muted/20">
        <CardTitle>Add New Debtor</CardTitle>
        <CardDescription>Record a new customer who owes you money</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
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
                  <FormLabel>Product/Service</FormLabel>
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
                            {product.name} ({formatCurrency(product.unit_price)})
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

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (RWF)</FormLabel>
                  <FormControl>
                    <Input type="number" step="1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col relative">
                  <FormLabel>Due Date</FormLabel>
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
                      className="absolute left-0 top-full mt-2 z-[999] bg-popover p-4 rounded-md border shadow-md"
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

            <Button
              type="submit"
              className="w-full bg-[var(--warning)] text-[var(--warning-foreground)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Debtor"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
