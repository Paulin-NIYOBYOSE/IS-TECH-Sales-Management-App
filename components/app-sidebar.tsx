"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Home,
  Package,
  ShoppingCart,
  Users,
  Moon,
  Sun,
  FileText,
  DollarSign,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure theme only renders after mount to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-[var(--primary)]" />
          <span className="text-lg font-bold">IsTech Ltd</span>
        </div>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link href="/dashboard">
                <Home className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/sales"}>
              <Link href="/dashboard/sales">
                <DollarSign className="h-5 w-5" />
                <span>Sales</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/products"}>
              <Link href="/dashboard/products">
                <Package className="h-5 w-5" />
                <span>Products</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/analysis"}>
              <Link href="/dashboard/analysis">
                <BarChart3 className="h-5 w-5" />
                <span>Analysis</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/debtors"}>
              <Link href="/dashboard/debtors">
                <Users className="h-5 w-5" />
                <span>Debtors</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/notes"}>
              <Link href="/dashboard/notes">
                <FileText className="h-5 w-5" />
                <span>Notes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="flex flex-col gap-4">
        {mounted && (
  <Button
    variant="outline"
    size="sm"
    className="justify-start"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  >
    {theme === "dark" ? (
      <>
        <Sun className="mr-2 h-4 w-4 text-red-500" />
        <span >Light Mode</span>
      </>
    ) : (
      <>
        <Moon className="mr-2 h-4 w-4 text-red-500" />
        <span>Dark Mode</span>
      </>
    )}
  </Button>
)}


          <div className="flex items-center gap-3 rounded-md border p-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>TS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Brother Shemu</span>
              <span className="text-xs text-muted-foreground">ishimweshemu@gmail.com</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
