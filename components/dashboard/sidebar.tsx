"use client"

import Link from "next/link"
import { BarChart3, Calendar, CreditCard, Home, Package, Settings, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"

interface DashboardSidebarProps {
  pathname: string
}

export function DashboardSidebar({ pathname }: DashboardSidebarProps) {
  const routes = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      title: "Sales",
      href: "/sales",
      icon: CreditCard,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Products",
      href: "/products",
      icon: Package,
    },
    {
      title: "Agenda",
      href: "/agenda",
      icon: Calendar,
    },
    {
      title: "Debtors",
      href: "/debtors",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2 px-2">
          <Package className="h-6 w-6" />
          <span className="font-bold">ElectroSales</span>
        </Link>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={pathname === route.href} tooltip={route.title}>
                <Link href={route.href}>
                  <route.icon className="h-4 w-4" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <img src="/placeholder.svg?height=32&width=32" alt="User" className="h-8 w-8 rounded-full" />
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin User</span>
            <span className="text-xs text-muted-foreground">admin@electrosales.com</span>
          </div>
        </div>
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}

