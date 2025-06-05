import { MapPin, Building, Twitter, Github, Linkedin, Globe, type LucideIcon } from "lucide-react"

export const Icons = {
  location: MapPin,
  company: Building,
  twitter: Twitter,
  gitHub: Github,
  linkedIn: Linkedin,
  website: Globe,
} as const

export type Icon = LucideIcon
