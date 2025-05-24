import { MatrixLink } from "@/components/matrix-link"

export default function SignIn() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">Sign In</h1>

        <p className="mt-3 text-2xl">Welcome back!</p>

        <div className="bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl mt-10">
          <div className="w-3/5 p-5">
            <div className="text-left font-bold">Sign in to your account</div>
            <div className="py-10">
              {/* Sign-in form would go here */}
              <p>Sign-in form coming soon!</p>
            </div>
          </div>
          <div className="w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12">
            <h2 className="text-3xl font-bold mb-2">Hello, Friend!</h2>
            <div className="border-2 w-10 border-white inline-block mb-2"></div>
            <p className="mb-10">Enter your personal details and start journey with us today</p>
            <MatrixLink
              href="/auth/sign-up"
              className="border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500"
            >
              Sign Up
            </MatrixLink>
          </div>
        </div>
      </main>
    </div>
  )
}
