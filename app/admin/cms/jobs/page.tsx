import JobsQueueClient from "./jobs-queue-client"

export default function JobsQueuePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Jobs Queue</h1>
        <p className="text-muted-foreground">Monitor background tasks and job processing</p>
      </div>

      <JobsQueueClient />
    </div>
  )
}
