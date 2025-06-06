// Utility for cross-site authentication
export function getCrossSiteAuthUrl(targetDomain: string, currentPath: string) {
  const allowedDomains = ["bigbased.com", "yoursecondsite.com"]

  if (!allowedDomains.includes(targetDomain)) {
    throw new Error("Domain not allowed for cross-site auth")
  }

  return `https://${targetDomain}${currentPath}?cross_site_auth=true`
}

export function handleCrossSiteAuth() {
  // Check if user came from cross-site auth
  const urlParams = new URLSearchParams(window.location.search)
  const isCrossSiteAuth = urlParams.get("cross_site_auth") === "true"

  if (isCrossSiteAuth) {
    // User is already authenticated via shared Supabase
    // Just redirect to intended page
    const redirectPath = urlParams.get("redirect") || "/"
    window.location.href = redirectPath
  }
}
