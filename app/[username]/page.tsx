import { notFound } from "next/navigation"

interface Params {
  username: string
}

interface Props {
  params: Params
}

export default function UserPage({ params }: Props) {
  // Exclude reserved routes
  if (params.username === "admin" || params.username === "api" || params.username === "auth") {
    notFound()
  }

  return (
    <div>
      <h1>User: {params.username}</h1>
    </div>
  )
}
