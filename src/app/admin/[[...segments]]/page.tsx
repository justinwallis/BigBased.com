import { AdminView } from "@payloadcms/next/views"
import configPromise from "../../payload.config"

export default function AdminPage() {
  return <AdminView config={configPromise} />
}

export const dynamic = "force-dynamic"
