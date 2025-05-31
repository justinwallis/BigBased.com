"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Bell, AlertTriangle, DollarSign, TrendingUp, Settings, Plus, Trash2, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BillingAlert {
  id: string
  name: string
  type: "spending_limit" | "usage_threshold" | "payment_failure" | "subscription_change"
  threshold: number
  enabled: boolean
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  conditions: {
    period: "daily" | "weekly" | "monthly" | "yearly"
    comparison: "greater_than" | "less_than" | "equals"
  }
}

export function BillingAlerts() {
  const { toast } = useToast()
  const [alerts, setAlerts] = useState<BillingAlert[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [newAlert, setNewAlert] = useState<Partial<BillingAlert>>({
    name: "",
    type: "spending_limit",
    threshold: 0,
    enabled: true,
    notifications: { email: true, push: false, sms: false },
    conditions: { period: "monthly", comparison: "greater_than" },
  })

  // Mock data
  const mockAlerts: BillingAlert[] = [
    {
      id: "alert_1",
      name: "Monthly Spending Limit",
      type: "spending_limit",
      threshold: 50,
      enabled: true,
      notifications: { email: true, push: true, sms: false },
      conditions: { period: "monthly", comparison: "greater_than" },
    },
    {
      id: "alert_2",
      name: "High Usage Warning",
      type: "usage_threshold",
      threshold: 80,
      enabled: true,
      notifications: { email: true, push: false, sms: false },
      conditions: { period: "monthly", comparison: "greater_than" },
    },
    {
      id: "alert_3",
      name: "Payment Failure Alert",
      type: "payment_failure",
      threshold: 1,
      enabled: true,
      notifications: { email: true, push: true, sms: true },
      conditions: { period: "daily", comparison: "greater_than" },
    },
  ]

  useEffect(() => {
    setAlerts(mockAlerts)
  }, [])

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "spending_limit":
        return <DollarSign className="h-4 w-4 text-red-500" />
      case "usage_threshold":
        return <TrendingUp className="h-4 w-4 text-yellow-500" />
      case "payment_failure":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "subscription_change":
        return <Settings className="h-4 w-4 text-blue-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case "spending_limit":
        return "Spending Limit"
      case "usage_threshold":
        return "Usage Threshold"
      case "payment_failure":
        return "Payment Failure"
      case "subscription_change":
        return "Subscription Change"
      default:
        return "Unknown"
    }
  }

  const handleCreateAlert = () => {
    if (!newAlert.name || !newAlert.threshold) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const alert: BillingAlert = {
      id: `alert_${Date.now()}`,
      name: newAlert.name!,
      type: newAlert.type!,
      threshold: newAlert.threshold!,
      enabled: newAlert.enabled!,
      notifications: newAlert.notifications!,
      conditions: newAlert.conditions!,
    }

    setAlerts([...alerts, alert])
    setNewAlert({
      name: "",
      type: "spending_limit",
      threshold: 0,
      enabled: true,
      notifications: { email: true, push: false, sms: false },
      conditions: { period: "monthly", comparison: "greater_than" },
    })
    setIsCreating(false)

    toast({
      title: "Alert Created",
      description: "Your billing alert has been created successfully",
    })
  }

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, enabled: !alert.enabled } : alert)))
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
    toast({
      title: "Alert Deleted",
      description: "The billing alert has been removed",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold dark:text-white">Billing Alerts & Budgets</h3>
          <p className="text-sm text-muted-foreground dark:text-gray-400">
            Set up alerts to monitor your spending and usage
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Alert</span>
        </Button>
      </div>

      {/* Active Alerts */}
      <div className="grid gap-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getAlertTypeIcon(alert.type)}
                  <div>
                    <h4 className="font-medium dark:text-white">{alert.name}</h4>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                      {getAlertTypeLabel(alert.type)} •
                      {alert.type === "spending_limit" ? ` $${alert.threshold}` : ` ${alert.threshold}%`} •
                      {alert.conditions.period}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    {alert.notifications.email && (
                      <Badge variant="secondary" className="text-xs">
                        Email
                      </Badge>
                    )}
                    {alert.notifications.push && (
                      <Badge variant="secondary" className="text-xs">
                        Push
                      </Badge>
                    )}
                    {alert.notifications.sms && (
                      <Badge variant="secondary" className="text-xs">
                        SMS
                      </Badge>
                    )}
                  </div>

                  <Switch checked={alert.enabled} onCheckedChange={() => handleToggleAlert(alert.id)} />

                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Alert Form */}
      {isCreating && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Create New Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alert-name" className="dark:text-gray-200">
                  Alert Name
                </Label>
                <Input
                  id="alert-name"
                  value={newAlert.name}
                  onChange={(e) => setNewAlert({ ...newAlert, name: e.target.value })}
                  placeholder="e.g., Monthly Budget Alert"
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="alert-type" className="dark:text-gray-200">
                  Alert Type
                </Label>
                <select
                  id="alert-type"
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({ ...newAlert, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="spending_limit">Spending Limit</option>
                  <option value="usage_threshold">Usage Threshold</option>
                  <option value="payment_failure">Payment Failure</option>
                  <option value="subscription_change">Subscription Change</option>
                </select>
              </div>

              <div>
                <Label htmlFor="threshold" className="dark:text-gray-200">
                  Threshold {newAlert.type === "spending_limit" ? "($)" : "(%)"}
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  value={newAlert.threshold}
                  onChange={(e) => setNewAlert({ ...newAlert, threshold: Number(e.target.value) })}
                  placeholder="50"
                  className="dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              <div>
                <Label htmlFor="period" className="dark:text-gray-200">
                  Period
                </Label>
                <select
                  id="period"
                  value={newAlert.conditions?.period}
                  onChange={(e) =>
                    setNewAlert({
                      ...newAlert,
                      conditions: { ...newAlert.conditions!, period: e.target.value as any },
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="dark:text-gray-200">Notification Methods</Label>
              <div className="flex space-x-6 mt-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newAlert.notifications?.email}
                    onCheckedChange={(checked) =>
                      setNewAlert({
                        ...newAlert,
                        notifications: { ...newAlert.notifications!, email: checked },
                      })
                    }
                  />
                  <span className="text-sm dark:text-gray-300">Email</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newAlert.notifications?.push}
                    onCheckedChange={(checked) =>
                      setNewAlert({
                        ...newAlert,
                        notifications: { ...newAlert.notifications!, push: checked },
                      })
                    }
                  />
                  <span className="text-sm dark:text-gray-300">Push</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newAlert.notifications?.sms}
                    onCheckedChange={(checked) =>
                      setNewAlert({
                        ...newAlert,
                        notifications: { ...newAlert.notifications!, sms: checked },
                      })
                    }
                  />
                  <span className="text-sm dark:text-gray-300">SMS</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleCreateAlert}>Create Alert</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Overview */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Monthly Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm dark:text-gray-300">Current Month Spending</span>
              <span className="font-medium dark:text-white">$39.98 / $50.00</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: "79.96%" }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground dark:text-gray-400">
              <span>79.96% used</span>
              <span>$10.02 remaining</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
