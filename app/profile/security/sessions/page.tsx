import { AuthProvider } from "@/contexts/auth-context"
import SessionsClientPage from "./SessionsClientPage"

export default function SessionsPage() {
  return (
    <AuthProvider>
      <SessionsClientPage />
    </AuthProvider>
  )
}
