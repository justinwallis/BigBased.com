import { CreditCard } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfileClientPage() {
  return (
    <Tabs defaultValue="profile" className="w-[400px]">
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Make changes to your profile here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Profile Content</p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>Manage your subscription and billing details here.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/profile/billing/upgrade">
              <Button className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Plan
              </Button>
            </Link>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Configure your application settings here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Settings Content</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
