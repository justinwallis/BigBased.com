"use client"

import { PublicProfilePageClient } from "./PublicProfilePageClient"

export default function Page({ params }: { params: { username: string } }) {
  const { username } = params
  return <PublicProfilePageClient username={username} />
}
