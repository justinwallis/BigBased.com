"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Shield, Bell, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
]

const ProfileClientPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id)

  return (
    <div className="container space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
      </div>
      <Tabs defaultValue={activeTab} className="space-y-4">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} onClick={() => setActiveTab(tab.id)}>
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
              <Link href="/profile/edit">
                <Button>Edit Profile</Button>
              </Link>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p>Profile Information Content</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="security" className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Security Settings</h2>
              <Link href="/profile/security">
                <Button>Manage Security</Button>
              </Link>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p>Security Settings Content</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Notification Preferences</h2>
              <Link href="/profile/notifications">
                <Button>Manage Notifications</Button>
              </Link>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p>Notification Preferences Content</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {activeTab === "billing" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Billing & Payment Methods</h2>
              <Link href="/profile/billing">
                <Button>Manage Payment Methods</Button>
              </Link>
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">Manage your payment methods and billing information</p>
                  <Link href="/profile/billing">
                    <Button variant="outline">Add Payment Method</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Tabs>
    </div>
  )
}

export default ProfileClientPage
