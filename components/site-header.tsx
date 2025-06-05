import type React from "react"

interface SiteHeaderProps {
  title: string
  socialLinks?: {
    [key: string]: string | undefined
  }
  username?: string
  profileData?: any[]
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ title, socialLinks, username, profileData }) => {
  return (
    <header>
      <h1>{title}</h1>
      <nav>
        {socialLinks &&
          Object.entries(socialLinks).map(([key, value]) => {
            if (value && typeof value === "string" && value.length > 0) {
              return (
                <a key={key} href={value}>
                  {key}
                </a>
              )
            }
            return null
          })}
      </nav>
      <div>{username && typeof username === "string" ? <p>Welcome, {username}!</p> : <p>Welcome, Guest!</p>}</div>
      <div>
        {Array.isArray(profileData) && profileData.length > 0 ? (
          <ul>
            {profileData.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        ) : (
          <p>No profile data available.</p>
        )}
      </div>
    </header>
  )
}

export default SiteHeader
