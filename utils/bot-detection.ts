// Bot detection utilities
export function isBot(userAgent: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegram/i,
    /slackbot/i,
    /discordbot/i,
    /googlebot/i,
    /bingbot/i,
    /yandexbot/i,
    /baiduspider/i,
    /duckduckbot/i,
    /applebot/i,
    /petalbot/i,
    /semrushbot/i,
    /ahrefsbot/i,
    /mj12bot/i,
    /dotbot/i,
    /rogerbot/i,
    /exabot/i,
    /facebot/i,
    /ia_archiver/i,
    /archive.org_bot/i,
    /wayback/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /go-http-client/i,
    /node/i,
    /axios/i,
    /postman/i,
    /insomnia/i,
    /httpie/i,
  ]

  return botPatterns.some((pattern) => pattern.test(userAgent))
}

export function isValidReferrer(referrer: string | null, allowedDomains: string[]): boolean {
  if (!referrer) return true // Allow direct visits

  try {
    const url = new URL(referrer)
    return allowedDomains.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`))
  } catch {
    return false
  }
}

export function shouldTrackVisit(userAgent: string | null, referrer: string | null, ip: string | null): boolean {
  // Skip if no user agent
  if (!userAgent) return false

  // Skip bots
  if (isBot(userAgent)) return false

  // Skip if from suspicious referrers
  const allowedDomains = [
    "bigbased.com",
    "bigbased.us",
    "basedbook.com",
    "google.com",
    "bing.com",
    "duckduckgo.com",
    "yahoo.com",
    "facebook.com",
    "twitter.com",
    "x.com",
    "linkedin.com",
    "reddit.com",
  ]

  if (referrer && !isValidReferrer(referrer, allowedDomains)) {
    return false
  }

  // Skip localhost and development IPs
  if (ip && (ip.includes("127.0.0.1") || ip.includes("::1") || ip.includes("localhost"))) {
    return false
  }

  return true
}
