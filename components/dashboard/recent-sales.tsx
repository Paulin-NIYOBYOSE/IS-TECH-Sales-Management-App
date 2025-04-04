import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentSalesProps {
  className?: string
}

export function RecentSales({ className }: RecentSalesProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Sales</CardTitle>
        <CardDescription>You made 128 sales this month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">John Doe</p>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$1,999.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Alice Smith</p>
              <p className="text-sm text-muted-foreground">alice.smith@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$1,499.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
              <AvatarFallback>RJ</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Robert Johnson</p>
              <p className="text-sm text-muted-foreground">robert.johnson@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$899.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
              <AvatarFallback>EB</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Emily Brown</p>
              <p className="text-sm text-muted-foreground">emily.brown@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$3,299.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
              <AvatarFallback>MW</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Michael Wilson</p>
              <p className="text-sm text-muted-foreground">michael.wilson@example.com</p>
            </div>
            <div className="ml-auto font-medium">+$699.00</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

