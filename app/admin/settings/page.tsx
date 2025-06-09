"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Shield, Plug, Zap, Scale, Palette, Bell, Key, HardDrive, Info } from "lucide-react"
import Link from "next/link"

export default function SystemSettingsPage() {
  // General Settings
  const [siteName, setSiteName] = useState("Big Based Platform")
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [contactEmail, setContactEmail] = useState("support@bigbased.com")

  // Security Settings
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [auditLoggingEnabled, setAuditLoggingEnabled] = useState(true)

  // Performance Settings
  const [cachingEnabled, setCachingEnabled] = useState(true)
  const [cdnEnabled, setCdnEnabled] = useState(true)
  const [imageOptimizationEnabled, setImageOptimizationEnabled] = useState(true)

  // Compliance & Data Governance
  const [dataRetentionPolicy, setDataRetentionPolicy] = useState("7_years")
  const [gdprCompliance, setGdprCompliance] = useState(true)
  const [ccpaCompliance, setCcpaCompliance] = useState(false)

  // Branding & Customization
  const [customCss, setCustomCss] = useState("")
  const [customJs, setCustomJs] = useState("")

  // Notification Management
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")

  // API Management
  const [apiKey, setApiKey] = useState("sk_xxxxxxxxxxxxxxxxxxxx")

  // Backup & Disaster Recovery
  const [backupFrequency, setBackupFrequency] = useState("daily")

  const handleSaveSettings = () => {
    // In a real application, this would send data to a backend API
    console.log("Saving settings:", {
      siteName,
      defaultLanguage,
      contactEmail,
      mfaEnabled,
      auditLoggingEnabled,
      cachingEnabled,
      cdnEnabled,
      imageOptimizationEnabled,
      dataRetentionPolicy,
      gdprCompliance,
      ccpaCompliance,
      customCss,
      customJs,
      emailNotificationsEnabled,
      pushNotificationsEnabled,
      webhookUrl,
      apiKey,
      backupFrequency,
    })
    alert("Settings saved! (Simulated)")
  }

  const generateNewApiKey = () => {
    const newKey = `sk_${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`
    setApiKey(newKey)
    alert("New API Key generated! (Simulated)")
  }

  const initiateManualBackup = () => {
    alert("Manual backup initiated! (Simulated)")
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center gap-4">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">System Settings</h1>
          <p className="text-muted-foreground">Configure global platform settings and enterprise features.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Basic information and default configurations for your platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="default-language">Default Language</Label>
            <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
              <SelectTrigger id="default-language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contact-email">Support Contact Email</Label>
            <Input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Authentication
          </CardTitle>
          <CardDescription>Manage platform-wide security features and authentication policies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mfa-toggle">Enable Multi-Factor Authentication (MFA)</Label>
            <Switch id="mfa-toggle" checked={mfaEnabled} onCheckedChange={setMfaEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="audit-logging-toggle">Enable Audit Logging</Label>
            <Switch id="audit-logging-toggle" checked={auditLoggingEnabled} onCheckedChange={setAuditLoggingEnabled} />
          </div>
          <Separator />
          <Button asChild variant="outline" className="w-full">
            <Link href="/profile/security/sessions">Manage User Sessions</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="h-5 w-5" />
            Integrations
          </CardTitle>
          <CardDescription>Configure connections to third-party services and APIs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="crm-api-key">CRM Integration (Salesforce)</Label>
            <Input id="crm-api-key" placeholder="Enter CRM API Key" />
            <Button variant="secondary" className="mt-2">
              Connect CRM
            </Button>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="analytics-api-key">Analytics Platform (Google Analytics)</Label>
            <Input id="analytics-api-key" placeholder="Enter Analytics Tracking ID" />
            <Button variant="secondary" className="mt-2">
              Configure Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance & Scalability
          </CardTitle>
          <CardDescription>Optimize platform performance and ensure high availability.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="caching-toggle">Enable Server-Side Caching</Label>
            <Switch id="caching-toggle" checked={cachingEnabled} onCheckedChange={setCachingEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="cdn-toggle">Enable Content Delivery Network (CDN)</Label>
            <Switch id="cdn-toggle" checked={cdnEnabled} onCheckedChange={setCdnEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="image-optimization-toggle">Enable Automatic Image Optimization</Label>
            <Switch
              id="image-optimization-toggle"
              checked={imageOptimizationEnabled}
              onCheckedChange={setImageOptimizationEnabled}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Compliance & Data Governance
          </CardTitle>
          <CardDescription>Define data handling policies and ensure regulatory compliance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="data-retention">Data Retention Policy</Label>
            <Select value={dataRetentionPolicy} onValueChange={setDataRetentionPolicy}>
              <SelectTrigger id="data-retention">
                <SelectValue placeholder="Select policy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1_year">1 Year</SelectItem>
                <SelectItem value="3_years">3 Years</SelectItem>
                <SelectItem value="7_years">7 Years (Default)</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="gdpr-compliance-toggle">GDPR Compliance</Label>
            <Switch id="gdpr-compliance-toggle" checked={gdprCompliance} onCheckedChange={setGdprCompliance} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ccpa-compliance-toggle">CCPA Compliance</Label>
            <Switch id="ccpa-compliance-toggle" checked={ccpaCompliance} onCheckedChange={setCcpaCompliance} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Branding & Customization
          </CardTitle>
          <CardDescription>Customize the look and feel of your platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Domain-specific branding and custom features are managed under{" "}
            <Link href="/admin/domains" className="text-primary hover:underline">
              Domain Management
            </Link>
            .
          </p>
          <div className="grid gap-2">
            <Label htmlFor="custom-css">Custom CSS (Global)</Label>
            <Textarea
              id="custom-css"
              placeholder="/* Add your custom CSS here */"
              value={customCss}
              onChange={(e) => setCustomCss(e.target.value)}
              rows={5}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="custom-js">Custom JavaScript (Global)</Label>
            <Textarea
              id="custom-js"
              placeholder="// Add your custom JavaScript here"
              value={customJs}
              onChange={(e) => setCustomJs(e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Management
          </CardTitle>
          <CardDescription>Configure how users and administrators receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications-toggle">Enable Email Notifications</Label>
            <Switch
              id="email-notifications-toggle"
              checked={emailNotificationsEnabled}
              onCheckedChange={setEmailNotificationsEnabled}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications-toggle">Enable Push Notifications</Label>
            <Switch
              id="push-notifications-toggle"
              checked={pushNotificationsEnabled}
              onCheckedChange={setPushNotificationsEnabled}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="webhook-url">Global Webhook URL</Label>
            <Input
              id="webhook-url"
              type="url"
              placeholder="https://your-webhook-endpoint.com"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
            <Button variant="secondary" className="mt-2">
              Test Webhook
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Management
          </CardTitle>
          <CardDescription>Manage API keys for programmatic access to your platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">Current API Key</Label>
            <Input id="api-key" type="text" value={apiKey} readOnly />
          </div>
          <div className="flex gap-2">
            <Button onClick={generateNewApiKey}>Generate New Key</Button>
            <Button variant="destructive">Revoke Current Key</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Backup & Disaster Recovery
          </CardTitle>
          <CardDescription>Configure backup schedules and initiate manual backups.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="backup-frequency">Automated Backup Frequency</Label>
            <Select value={backupFrequency} onValueChange={setBackupFrequency}>
              <SelectTrigger id="backup-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={initiateManualBackup}>Initiate Manual Backup Now</Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save All Settings</Button>
      </div>
    </div>
  )
}
