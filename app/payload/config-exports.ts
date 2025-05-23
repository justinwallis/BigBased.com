// Re-export the config from the root payload.config.ts file
import payloadConfig, { config as namedConfig } from "@/payload.config"

// Export as both named and default exports
export const config = namedConfig
export default payloadConfig
