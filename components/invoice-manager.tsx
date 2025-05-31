"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Receipt, Download, Search, Filter, Eye, Mail, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Invoice {
  id: string
  number: string
  date: string
  dueDate: string
  amount: number
  status: "paid" | "pending" | "overdue" | "failed"
  description: string
  paymentMethod: string
  downloadUrl: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
}

export function InvoiceManager() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // Mock data
  const mockInvoices: Invoice[] = [
    {
      id: "inv_001",
      number: "BB-2024-001",
      date: "2024-01-15",
      dueDate: "2024-02-15",
      amount: 19.99,
      status: "paid",
      description: "Based Supporter Monthly Subscription",
      paymentMethod: "Visa •••• 4242",
      downloadUrl: "/invoices/BB-2024-001.pdf",
      items: [
        {
          description: "Based Supporter Plan",
          quantity: 1,
          unitPrice: 19.99,
          total: 19.99,
        },
      ],
    },
    {
      id: "inv_002",
      number: "BB-2024-002",
      date: "2024-02-15",
      dueDate: "2024-03-15",
      amount: 19.99,
      status: "paid",
      description: "Based Supporter Monthly Subscription",
      paymentMethod: "PayPal",
      downloadUrl: "/invoices/BB-2024-002.pdf",
      items: [
        {
          description: "Based Supporter Plan",
          quantity: 1,
          unitPrice: 19.99,
          total: 19.99,
        },
      ],
    },
    {
      id: "inv_003",
      number: "BB-2024-003",
      date: "2024-03-15",
      dueDate: "2024-04-15",
      amount: 39.98,
      status: "pending",
      description: "Based Patriot Monthly Subscription",
      paymentMethod: "Visa •••• 4242",
      downloadUrl: "/invoices/BB-2024-003.pdf",
      items: [
        {
          description: "Based Patriot Plan",
          quantity: 1,
          unitPrice: 39.98,
          total: 39.98,
        },
      ],
    },
  ]

  useEffect(() => {
    setInvoices(mockInvoices)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const paidAmount = filteredInvoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header with summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Total Invoices</p>
                <p className="text-2xl font-bold dark:text-white">{filteredInvoices.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Total Amount</p>
                <p className="text-2xl font-bold dark:text-white">${totalAmount.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground dark:text-gray-400">Paid Amount</p>
                <p className="text-2xl font-bold dark:text-white">${paidAmount.toFixed(2)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="failed">Failed</option>
              </select>
              <Button variant="outline" size="sm" className="dark:border-gray-600">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice List */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(invoice.status)}
                    <div>
                      <p className="font-medium dark:text-white">{invoice.number}</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400">
                        {new Date(invoice.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm dark:text-gray-300">{invoice.description}</p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">Payment: {invoice.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-medium dark:text-white">${invoice.amount.toFixed(2)}</p>
                    <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl dark:bg-gray-800">
                        <DialogHeader>
                          <DialogTitle className="dark:text-white">Invoice {selectedInvoice?.number}</DialogTitle>
                        </DialogHeader>
                        {selectedInvoice && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Invoice Date</p>
                                <p className="font-medium dark:text-white">
                                  {new Date(selectedInvoice.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Due Date</p>
                                <p className="font-medium dark:text-white">
                                  {new Date(selectedInvoice.dueDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Status</p>
                                <Badge className={getStatusColor(selectedInvoice.status)}>
                                  {selectedInvoice.status}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground dark:text-gray-400">Payment Method</p>
                                <p className="font-medium dark:text-white">{selectedInvoice.paymentMethod}</p>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-3 dark:text-white">Invoice Items</h4>
                              <div className="border rounded-lg dark:border-gray-600">
                                <table className="w-full">
                                  <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                      <th className="px-4 py-2 text-left text-sm font-medium dark:text-white">
                                        Description
                                      </th>
                                      <th className="px-4 py-2 text-right text-sm font-medium dark:text-white">Qty</th>
                                      <th className="px-4 py-2 text-right text-sm font-medium dark:text-white">
                                        Unit Price
                                      </th>
                                      <th className="px-4 py-2 text-right text-sm font-medium dark:text-white">
                                        Total
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedInvoice.items.map((item, index) => (
                                      <tr key={index} className="border-t dark:border-gray-600">
                                        <td className="px-4 py-2 dark:text-gray-300">{item.description}</td>
                                        <td className="px-4 py-2 text-right dark:text-gray-300">{item.quantity}</td>
                                        <td className="px-4 py-2 text-right dark:text-gray-300">${item.unitPrice}</td>
                                        <td className="px-4 py-2 text-right font-medium dark:text-white">
                                          ${item.total}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                      <td colSpan={3} className="px-4 py-2 text-right font-medium dark:text-white">
                                        Total:
                                      </td>
                                      <td className="px-4 py-2 text-right font-bold dark:text-white">
                                        ${selectedInvoice.amount}
                                      </td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            </div>

                            <div className="flex space-x-3">
                              <Button className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Download PDF
                              </Button>
                              <Button variant="outline" className="flex-1 dark:border-gray-600">
                                <Mail className="h-4 w-4 mr-2" />
                                Email Invoice
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
