import {
  Check,
  Crown,
  Star,
  Zap,
  Shield,
  Users,
  BookOpen,
  Video,
  MessageSquare,
  Download,
  CreditCard,
  Building2,
  Smartphone,
  Globe,
  type LucideIcon,
} from "lucide-react"

export const Icons = {
  check: Check,
  crown: Crown,
  star: Star,
  zap: Zap,
  shield: Shield,
  users: Users,
  bookOpen: BookOpen,
  video: Video,
  messageSquare: MessageSquare,
  download: Download,
  creditCard: CreditCard,
  building: Building2,
  smartphone: Smartphone,
  globe: Globe,
} as const

export type IconName = keyof typeof Icons
export type IconComponent = LucideIcon
