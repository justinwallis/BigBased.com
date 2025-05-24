"use client"
import FundraisingProgressBar from "./fundraising-progress-bar"
import DonationFeed from "./prayer-feed"

export default function FundraisingAndPrayerSection() {
  return (
    <section className="py-8 px-4 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      {/* Binary code background effect */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full font-mono text-xs leading-none text-black dark:text-green-400">
          {Array.from({ length: 50 }).map((_, i) => (
            <div key={i} className="whitespace-nowrap">
              {Array.from({ length: 100 }).map((_, j) => (
                <span key={j}>{Math.round(Math.random())}</span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FundraisingProgressBar campaignUrl="https://www.givesendgo.com/bigbased" />
          <DonationFeed />
        </div>
      </div>
    </section>
  )
}
