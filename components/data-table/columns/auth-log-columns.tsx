"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { ShieldAlert, ShieldCheck, Info, AlertCircle } from "lucide-react"

// Define the type for auth log data
export type AuthLog = {
  id: number
  user_id: string
  event_type: string
  status: string
  ip_address: string
  user_agent: string
  created_at: string
  details: Record<string, any>
}

// Helper function to format event type for display
function formatEventType(eventType: string) {
  return eventType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Helper function to get event icon
function getEventIcon(eventType: string, status: string) {
  if (status === "success") {
    return <ShieldCheck className="h-4 w-4 text-green-500" />
  } else if (status === "failure") {
    return <ShieldAlert className="h-4 w-4 text-red-500" />
  } else if (status === "pending") {
    return <Info className="h-4 w-4 text-blue-500" />
  } else {
    return <AlertCircle className="h-4 w-4 text-gray-500" />
  }
}

// Define the columns for the auth logs table
export const authLogColumns: ColumnDef<AuthLog>[] = [
  {
    accessorKey: "event_type",
    header: "Event",
    cell: ({ row }) => {
      const eventType = row.getValue("event_type") as string
      const status = row.getValue("status") as string

      return (
        <div className="flex items-center gap-2">
          {getEventIcon(eventType, status)}
          <span>{formatEventType(eventType)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <Badge
          variant={
            status === "success"
              ? "success"
              : status === "failure"
                ? "destructive"
                : status === "pending"
                  ? "outline"
                  : "secondary"
          }
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "ip_address",
    header: "IP Address",
  },
  {
    accessorKey: "created_at",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at") as string)
      return <span>{date.toLocaleString()}</span>
    },
  },
]
