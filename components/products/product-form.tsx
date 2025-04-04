"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { createProduct } from "@/app/actions/product-actions"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  price: z.coerce.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  stock: z.coerce.number().min(0, {
    message: "Stock cannot be negative.",
  }),
  description: z.string().optional(),
  sku: z.string().min(1, {
    message: "SKU is required.",
  }),
  barcode: z.string().optional(),
})

export function ProductForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      sku: "",
      barcode: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData()

    // Add form values to FormData
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value?.toString() || "")
    })

    const result = await createProduct(formData)

    if (result.success) {
      toast({
        title: "Product added",
        description: `${values.name} has been added to your inventory.`,
      })
      router.push("/products")
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add product",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Smartphone X Pro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Smartphones">Smartphones</SelectItem>
                    <SelectItem value="Laptops">Laptops</SelectItem>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Wearables">Wearables</SelectItem>
                    <SelectItem value="TVs">TVs</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="SKU123456" {...field} />
                </FormControl>
                <FormDescription>Stock Keeping Unit - your internal product code</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="barcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barcode (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="123456789012" {...field} />
                </FormControl>
                <FormDescription>UPC, EAN, or other barcode format</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Product description and specifications" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/products")}>
            Cancel
          </Button>
          <Button type="submit">Add Product</Button>
        </div>
      </form>
    </Form>
  )
}

