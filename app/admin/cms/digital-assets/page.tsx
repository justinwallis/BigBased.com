import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileCheck, AlertTriangle, Calendar, ImageIcon, FileText, Settings } from "lucide-react"

export default function DigitalAssetRightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/cms" className="text-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to CMS
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Digital Asset Rights Management</h1>
          <p className="text-muted-foreground">Manage licenses, usage rights, and compliance for your digital assets</p>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Expiring Licenses</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">3</div>
            <p className="text-xs text-amber-600">Licenses expiring in next 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Expired Licenses</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">1</div>
            <p className="text-xs text-red-600">Assets with expired licenses still in use</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Compliant Assets</CardTitle>
            <FileCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">142</div>
            <p className="text-xs text-green-600">Assets with valid licenses</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              License Management
            </CardTitle>
            <CardDescription>Manage all your digital asset licenses in one place</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/digital-assets/licenses">
                <FileCheck className="h-4 w-4 mr-2" />
                Manage Licenses
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Add, edit, and track license information</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Asset Usage Tracking
            </CardTitle>
            <CardDescription>Track where and how your licensed assets are being used</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/digital-assets/usage">
                <ImageIcon className="h-4 w-4 mr-2" />
                Usage Tracking
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Monitor asset usage across content</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              License Calendar
            </CardTitle>
            <CardDescription>View upcoming license expirations and renewals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/digital-assets/calendar">
                <Calendar className="h-4 w-4 mr-2" />
                License Calendar
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Plan for renewals and expirations</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Compliance Alerts
            </CardTitle>
            <CardDescription>Manage and resolve license compliance issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/digital-assets/alerts">
                <AlertTriangle className="h-4 w-4 mr-2" />
                View Alerts
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Address compliance issues</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              License Reports
            </CardTitle>
            <CardDescription>Generate reports on license usage and compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/digital-assets/reports">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Export compliance documentation</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              License Settings
            </CardTitle>
            <CardDescription>Configure license types and notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/digital-assets/settings">
                <Settings className="h-4 w-4 mr-2" />
                Configure Settings
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Customize your license management</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Expiring Licenses */}
      <Card>
        <CardHeader>
          <CardTitle>Expiring Licenses</CardTitle>
          <CardDescription>Assets with licenses expiring soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Hero Image - Homepage</h3>
                    <p className="text-sm text-muted-foreground">Adobe Stock License</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Expires in 7 days</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Renew License
                  </Button>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Team Photo - About Page</h3>
                    <p className="text-sm text-muted-foreground">Photographer License</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Expires in 14 days</div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Renew License
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
