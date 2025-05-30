import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
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
      {/* Billing Tab */}
      <TabsContent value="billing">
        <Card>
          <CardHeader>
            <CardTitle>Billing & Subscription</CardTitle>
            <CardDescription>Manage your subscription and billing information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Current Plan</h4>
                  <p className="text-sm text-muted-foreground">Free Plan - No active subscription</p>
                </div>
                <Link href="/profile/billing/upgrade">
                  <Button>Upgrade Plan</Button>
                </Link>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Payment Methods</h4>
                  <p className="text-sm text-muted-foreground">No payment methods on file</p>
                </div>
                <Link href="/profile/billing">
                  <Button variant="outline">Add Payment Method</Button>
                </Link>
              </div>
            </div>
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
