import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Scale, AlertTriangle, CheckCircle, Clock, FileText, Shield, Zap } from "lucide-react"

export default function ComplianceAutomationPage() {
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
          <h1 className="text-3xl font-bold text-foreground">Compliance Automation</h1>
          <p className="text-muted-foreground">Automated regulatory compliance monitoring and risk management</p>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Overall Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">94.2%</div>
            <p className="text-sm text-muted-foreground">Compliance rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Open Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">7</div>
            <p className="text-sm text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              Last Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">2 hours ago</div>
            <p className="text-sm text-muted-foreground">Automated scan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Regulations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">8</div>
            <p className="text-sm text-muted-foreground">Monitored</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Compliance Rules
            </CardTitle>
            <CardDescription>Manage and configure compliance rules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/admin/cms/compliance/rules">
                <Scale className="h-4 w-4 mr-2" />
                Manage Rules
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>GDPR, CCPA, ADA, WCAG compliance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automated Scans
            </CardTitle>
            <CardDescription>Schedule and run compliance scans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/compliance/scans">
                <Zap className="h-4 w-4 mr-2" />
                View Scans
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Real-time and scheduled scanning</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance Reports
            </CardTitle>
            <CardDescription>Generate regulatory compliance reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/cms/compliance/reports">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Link>
            </Button>
            <div className="text-sm text-muted-foreground">
              <p>Audit-ready documentation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Current Compliance Issues</CardTitle>
          <CardDescription>Issues requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-red-600">Missing Alt Text on Images</h3>
                  <p className="text-sm text-muted-foreground">WCAG 2.1 AA Violation</p>
                  <p className="text-sm mt-1">Found on: /blog/enterprise-cms-guide</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="destructive">Critical</Badge>
                  <Badge variant="outline">ADA</Badge>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm">Auto-Fix</Button>
                <Button size="sm" variant="outline">
                  Review
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-yellow-600">Cookie Consent Banner</h3>
                  <p className="text-sm text-muted-foreground">GDPR Compliance Check</p>
                  <p className="text-sm mt-1">Banner not displaying on EU traffic</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Medium</Badge>
                  <Badge variant="outline">GDPR</Badge>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm">Configure</Button>
                <Button size="sm" variant="outline">
                  Test
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-blue-600">Data Retention Policy</h3>
                  <p className="text-sm text-muted-foreground">CCPA Compliance</p>
                  <p className="text-sm mt-1">User data retention exceeds 12 months</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Low</Badge>
                  <Badge variant="outline">CCPA</Badge>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm">Review Policy</Button>
                <Button size="sm" variant="outline">
                  Schedule Cleanup
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regulation Status */}
      <Card>
        <CardHeader>
          <CardTitle>Regulation Compliance Status</CardTitle>
          <CardDescription>Current compliance status across all monitored regulations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">GDPR (EU)</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">96.8%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">CCPA (California)</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">94.2%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">ADA (Accessibility)</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">89.1%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">WCAG 2.1 AA</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">87.5%</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">SOX (Financial)</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">98.1%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">HIPAA (Healthcare)</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">95.7%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">PCI DSS (Payment)</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">97.3%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">ISO 27001</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">93.8%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
