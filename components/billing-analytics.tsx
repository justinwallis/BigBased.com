"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Target,
  AlertTriangle,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

interface BillingAnalyticsProps {
  customerId: string
}

export function BillingAnalytics({ customerId }: BillingAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("6months")
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  // Mock data - in real app, fetch from your analytics API
  const mockData = {
    totalSpent: 239.88,
    monthlyAverage: 19.99,
    trend: 12.5,
    projectedAnnual: 239.88,
    paymentMethodUsage: [
      { name: "Credit Card", value: 65, color: "#3b82f6" },
      { name: "PayPal", value: 25, color: "#f59e0b" },
      { name: "Bank Transfer", value: 10, color: "#10b981" },
    ],
    monthlySpending: [
      { month: "Jan", amount: 19.99, plan: "Based Supporter" },
      { month: "Feb", amount: 19.99, plan: "Based Supporter" },
      { month: "Mar", amount: 39.98, plan: "Based Patriot" },
      { month: "Apr", amount: 19.99, plan: "Based Patriot" },
      { month: "May", amount: 19.99, plan: "Based Patriot" },
      { month: "Jun", amount: 19.99, plan: "Based Patriot" },
    ],
    usageMetrics: {
      downloads: { current: 45, limit: -1, percentage: 100 },
      bookmarks: { current: 23, limit: 100, percentage: 23 },
      apiCalls: { current: 1250, limit: 5000, percentage: 25 },
    },
    costOptimization: [
      {
        type: "downgrade",
        title: "Consider Based Supporter Plan",
        description: "You're using 60% of Patriot features. Save $10/month with Supporter plan.",
        savings: 120,
        confidence: 85,
      },
    ],
  }

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setAnalyticsData(mockData), 500)
  }, [timeRange])

  if (!analyticsData) {
    return <div className="animate-pulse">Loading analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold dark:text-white">Billing Analytics</h3>
        <div className="flex space-x-2">
          {["3months", "6months", "1year", "all"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="dark:border-gray-600"
            >
              {range === "3months" ? "3M" : range === "6months" ? "6M" : range === "1year" ? "1Y" : "All"}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Total Spent</p>
                <p className="text-2xl font-bold dark:text-white">${analyticsData.totalSpent}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+{analyticsData.trend}%</span>
              <span className="text-muted-foreground dark:text-gray-400 ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Monthly Average</p>
                <p className="text-2xl font-bold dark:text-white">${analyticsData.monthlyAverage}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">Based on {timeRange} data</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Projected Annual</p>
                <p className="text-2xl font-bold dark:text-white">${analyticsData.projectedAnnual}</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">Based on current usage</p>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Potential Savings</p>
                <p className="text-2xl font-bold text-green-500">$120</p>
              </div>
              <TrendingDown className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-sm text-muted-foreground dark:text-gray-400 mt-2">Optimization available</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trend Chart */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <BarChart3 className="h-5 w-5" />
              <span>Monthly Spending Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analyticsData.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [`$${value}`, "Amount"]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payment Method Usage */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 dark:text-white">
              <PieChart className="h-5 w-5" />
              <span>Payment Method Usage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie data={analyticsData.paymentMethodUsage} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                  {analyticsData.paymentMethodUsage.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, "Usage"]} />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {analyticsData.paymentMethodUsage.map((item: any) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm dark:text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Metrics */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Plan Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(analyticsData.usageMetrics).map(([key, metric]: [string, any]) => (
              <div key={key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium dark:text-white capitalize">{key}</span>
                  <span className="text-sm text-muted-foreground dark:text-gray-400">
                    {metric.current}
                    {metric.limit > 0 ? `/${metric.limit}` : " (unlimited)"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      metric.percentage > 80 ? "bg-red-500" : metric.percentage > 60 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(metric.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">{metric.percentage}% used</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Optimization Suggestions */}
      {analyticsData.costOptimization.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700 border-yellow-200 bg-yellow-50 dark:bg-yellow-950">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-5 w-5" />
              <span>Cost Optimization Suggestions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.costOptimization.map((suggestion: any, index: number) => (
              <div key={index} className="flex items-start justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium dark:text-white">{suggestion.title}</h4>
                  <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">{suggestion.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      Save ${suggestion.savings}/year
                    </Badge>
                    <span className="text-xs text-muted-foreground dark:text-gray-400">
                      {suggestion.confidence}% confidence
                    </span>
                  </div>
                </div>
                <Button size="sm" className="ml-4">
                  Apply Suggestion
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Export Options */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Export & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" className="dark:border-gray-600">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" className="dark:border-gray-600">
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
            <Button variant="outline" size="sm" className="dark:border-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Monthly Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
