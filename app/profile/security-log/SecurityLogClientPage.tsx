"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ShieldAlert, ShieldCheck, AlertCircle, Info } from "lucide-react"
import { getUserAuthLogs } from "@/app/actions/auth-log-actions"
import { DataTableView } from "@/components/data-table/data-table-view"
import { authLogColumns } from "@/components/data-table/columns/auth-log-columns"

// Event type options for filtering
const EVENT_TYPE_OPTIONS = [
  { value: "", label: "All Events" },
  { value: "login_attempt", label: "Login Attempts" },
  { value: "login_success", label: "Successful Logins" },
  { value: "login_failure", label: "Failed Logins" },
  { value: "mfa_verification_attempt", label: "MFA Verification Attempts" },
  { value: "mfa_verification_success", label: "Successful MFA Verifications" },
  { value: "mfa_verification_failure", label: "Failed MFA Verifications" },
  { value: "mfa_setup_attempt", label: "MFA Setup Attempts" },
  { value: "mfa_setup_success", label: "Successful MFA Setups" },
  { value: "backup_code_generation", label: "Backup Code Generation" },
  { value: "backup_code_usage", label: "Backup Code Usage" },
]

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

// Helper function to format event type for display
function formatEventType(eventType: string) {
  return eventType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export default function SecurityLogClientPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  })

  // Filters
  const [eventType, setEventType] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  // Check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, supabase])

  // Fetch logs when filters or pagination changes
  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      setError(null)

      try {
        const filters: any = {}

        if (eventType) {
          filters.eventType = eventType
        }

        if (startDate) {
          filters.startDate = startDate.toISOString()
        }

        if (endDate) {
          // Set to end of day
          const endOfDay = new Date(endDate)
          endOfDay.setHours(23, 59, 59, 999)
          filters.endDate = endOfDay.toISOString()
        }

        const result = await getUserAuthLogs(pagination.page, pagination.pageSize, filters)

        if (result.success) {
          setLogs(result.data || [])
          setPagination(result.pagination)
        } else {
          setError(result.error || "Failed to fetch security logs")
        }
      } catch (error) {
        console.error("Error fetching security logs:", error)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [pagination.page, pagination.pageSize, eventType, startDate, endDate])

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  // Handle filter reset
  const handleResetFilters = () => {
    setEventType("")
    setStartDate(undefined)
    setEndDate(undefined)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  return (
    <div className="container max-w-4xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Security Log</CardTitle>
          <CardDescription>View your account security activity and authentication history</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <h3 className="text-sm font-medium">Filters</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Event Type Filter */}
              <div className="space-y-2">
                <label className="text-sm">Event Type</label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date Filter */}
              <div className="space-y-2">
                <label className="text-sm">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date Filter */}
              <div className="space-y-2">
                <label className="text-sm">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => (startDate ? date < startDate : false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 text-red-800 p-4 rounded-md mb-4">{error}</div>}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-2 text-sm text-gray-500">Loading security logs...</p>
            </div>
          )}

          {/* Logs Table */}
          {!loading && logs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No security logs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {!loading && logs.length > 0 && <DataTableView columns={authLogColumns} data={logs} />}
            </div>
          )}

          {/* Pagination */}
          {!loading && logs.length > 0 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
                      disabled={pagination.page === 1}
                    />
                  </PaginationItem>

                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) => page === 1 || page === pagination.totalPages || Math.abs(page - pagination.page) <= 1,
                    )
                    .map((page, i, array) => {
                      // Add ellipsis
                      if (i > 0 && array[i - 1] !== page - 1) {
                        return (
                          <PaginationItem key={`ellipsis-${page}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )
                      }

                      return (
                        <PaginationItem key={page}>
                          <PaginationLink isActive={page === pagination.page} onClick={() => handlePageChange(page)}>
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.page + 1))}
                      disabled={pagination.page === pagination.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            Showing {logs.length} of {pagination.total} logs
          </p>
          <Button variant="outline" onClick={() => router.push("/profile")}>
            Back to Profile
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
