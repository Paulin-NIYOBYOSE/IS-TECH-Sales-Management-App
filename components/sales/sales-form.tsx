"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { getProducts } from "@/app/actions/product-actions"
import { createSale } from "@/app/actions/sale-actions"

const formSchema = z.object({
  customer: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  product: z.string().min(1, {
    message: "Please select a product.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  price: z.coerce.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  paymentMethod: z.string().min(1, {
    message: "Please select a payment method.",
  }),
  notes: z.string().optional(),
})

type Product = {
  id: string
  name: string
  price: number
}

export function SalesForm() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProducts() {
      try {
        const fetchedProducts = await getProducts()
        setProducts(
          fetchedProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
          })),
        )
      } catch (error) {
        console.error("Failed to load products:", error)
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: "",
      email: "",
      product: "",
      quantity: 1,
      price: 0,
      date: new Date(),
      paymentMethod: "",
      notes: "",
    },
  })

  // Update price when product changes
  const watchProduct = form.watch("product")

  useEffect(() => {
    if (watchProduct) {
      const selectedProduct = products.find((p) => p.id === watchProduct)
      if (selectedProduct) {
        form.setValue("price", selectedProduct.price)
      }
    }
  }, [watchProduct, products, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()

    // Add form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      if (key === "date") {
        formData.append(key, value.toISOString())
      } else {
        formData.append(key, value?.toString() || "")
      }
    })

    const result = await createSale(formData)

    if (result.success) {
      toast({
        title: "Sale recorded successfully",
        description: `Sale has been recorded.`,
      })
      router.push("/sales")
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to record sale",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading products...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="customer"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ${product.price.toFixed(2)}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no_products" disabled>
                        No products available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-6 grid-cols-2">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" min={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={0.01} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="paymentMethod"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Method</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional information about the sale" className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Optional notes about the sale or customer preferences.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/sales")}>
            Cancel
          </Button>
          <Button type="submit">Record Sale</Button>
        </div>
      </form>
    </Form>
  )
}

