import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import FormBuilderClient from "./form-builder-client"

export default function FormsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Form Builder</h1>
          <p className="text-muted-foreground">Create and manage custom forms for your website</p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/forms/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Form
          </Link>
        </Button>
      </div>

      <FormBuilderClient />
    </div>
  )
}
