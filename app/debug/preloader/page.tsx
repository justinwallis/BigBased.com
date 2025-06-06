import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Preloader Debug | Big Based",
  description: "Debug preloader functionality",
}

export default function PreloaderDebugPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Preloader Debug</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Preloader Testing</h2>
        <p className="text-gray-600 dark:text-gray-300">Test preloader functionality</p>
      </div>
    </div>
  )
}
