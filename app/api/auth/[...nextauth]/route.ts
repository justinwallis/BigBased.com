import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a simple handler with detailed error logging
const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("NextAuth authorize function called")

          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials")
            return null
          }

          const supabase = createClient(supabaseUrl, supabaseAnonKey)

          console.log("Attempting Supabase sign in")
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error) {
            console.error("Supabase auth error:", error.message)
            return null
          }

          if (!data.user) {
            console.log("No user returned from Supabase")
            return null
          }

          console.log("Supabase auth successful")
          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.email,
          }
        } catch (error) {
          console.error("NextAuth authorize unexpected error:", error)
          return null
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: true,
})

export { handler as GET, handler as POST }
