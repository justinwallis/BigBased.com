"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "./components/Overview"
import { Security } from "./components/Security"
import { Billing } from "./components/Billing"
import { Notifications } from "./components/Notifications"
import { useSearchParams } from "next/navigation"

export default function ProfileClientPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const initialTab = searchParams.get("tab") || "general"
  const [activeTab, setActiveTab] = useState(initialTab)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">Manage your profile settings and preferences.</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <Overview isLoading={isLoading} setIsLoading={setIsLoading} />
        </TabsContent>
        <TabsContent value="security">
          <Security isLoading={isLoading} setIsLoading={setIsLoading} />
        </TabsContent>
        <TabsContent value="billing">
          <Billing isLoading={isLoading} setIsLoading={setIsLoading} />
        </TabsContent>
        <TabsContent value="notifications">
          <Notifications isLoading={isLoading} setIsLoading={setIsLoading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
