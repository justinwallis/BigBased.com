import { Suspense } from "react"
import AIManagementClient from "./ai-management-client"

export default function AIManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI & RAG Management</h1>
        <p className="text-muted-foreground">Manage your AI assistant and knowledge base</p>
      </div>

      <Suspense fallback={<div>Loading AI management...</div>}>
        <AIManagementClient />
      </Suspense>
    </div>
  )
}
