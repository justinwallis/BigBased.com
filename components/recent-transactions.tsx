"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  status: "succeeded" | "pending" | "failed"
  invoice_url?: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 dark:text-white">
          <Receipt className="h-5 w-5" />
          <span>Recent Transactions</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground dark:text-gray-400 text-center py-4">No transactions yet</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-600"
              >
                <div className="space-y-1">
                  <p className="font-medium dark:text-white">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                  <span className="font-medium dark:text-white">${transaction.amount.toFixed(2)}</span>
                  {transaction.invoice_url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={transaction.invoice_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
