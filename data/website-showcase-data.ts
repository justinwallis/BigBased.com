export interface WebsiteShowcaseItem {
  id: string
  name: string
  logo: string
  url: string
  category: string
  description: string
  previewImage: string
  features: string[]
  technologies: string[]
}

export const websiteShowcaseData: WebsiteShowcaseItem[] = [
  {
    id: "freedom-foundation",
    name: "Freedom Foundation",
    logo: "/freedom-foundation-building.png",
    url: "https://example.com/freedom-foundation",
    category: "Organization",
    description:
      "A leading organization dedicated to preserving constitutional rights and promoting traditional values across America. The Freedom Foundation works with communities, lawmakers, and citizens to protect individual liberties.",
    previewImage: "/freedom-foundation-building.png",
    features: [
      "Constitutional education programs",
      "Legal advocacy for religious freedom",
      "Community organizing resources",
      "Policy research and development",
    ],
    technologies: [
      "Decentralized hosting",
      "End-to-end encryption",
      "Self-hosted email services",
      "Open-source content management",
    ],
  },
  {
    id: "liberty-tech",
    name: "Liberty Tech",
    logo: "/liberty-tech-office.png",
    url: "https://example.com/liberty-tech",
    category: "Technology",
    description:
      "Liberty Tech develops privacy-focused software solutions that empower individuals and organizations to maintain digital sovereignty. Their tools enable secure communication and data storage outside big tech ecosystems.",
    previewImage: "/liberty-tech-office.png",
    features: [
      "Encrypted messaging platform",
      "Decentralized cloud storage",
      "Privacy-focused browser extensions",
      "Digital identity protection tools",
    ],
    technologies: [
      "Blockchain infrastructure",
      "Zero-knowledge proofs",
      "Peer-to-peer networking",
      "Client-side encryption",
    ],
  },
  {
    id: "patriot-university",
    name: "Patriot University",
    logo: "/patriot-university-campus.png",
    url: "https://example.com/patriot-university",
    category: "Education",
    description:
      "Patriot University offers traditional education with an emphasis on Western values, critical thinking, and classical liberal arts. Their curriculum is designed to foster independent thought and preserve cultural heritage.",
    previewImage: "/patriot-university-campus.png",
    features: [
      "Classical education curriculum",
      "Online and in-person courses",
      "Historical preservation initiatives",
      "Student-led research programs",
    ],
    technologies: [
      "Custom learning management system",
      "Digital archives and libraries",
      "Interactive virtual classrooms",
      "Self-hosted video conferencing",
    ],
  },
  {
    id: "truth-network",
    name: "Truth Network",
    logo: "/truth-network-community.png",
    url: "https://example.com/truth-network",
    category: "Media",
    description:
      "Truth Network is an independent media platform delivering news and analysis free from corporate influence. Their reporting focuses on transparency, factual accuracy, and perspectives often overlooked by mainstream outlets.",
    previewImage: "/truth-network-community.png",
    features: [
      "Independent journalism",
      "Community fact-checking",
      "Uncensored discussion forums",
      "Citizen reporter platform",
    ],
    technologies: [
      "Distributed content delivery",
      "Censorship-resistant infrastructure",
      "Community moderation tools",
      "Alternative payment systems",
    ],
  },
  {
    id: "sovereign-systems",
    name: "Sovereign Systems",
    logo: "/sovereign-systems-tech.png",
    url: "https://example.com/sovereign-systems",
    category: "Technology",
    description:
      "Sovereign Systems builds infrastructure for digital independence, including self-hosted servers, mesh networks, and alternative internet solutions that operate outside traditional ISPs and cloud providers.",
    previewImage: "/sovereign-systems-tech.png",
    features: [
      "Mesh network hardware",
      "Self-hosted server solutions",
      "Alternative DNS services",
      "Local-first software applications",
    ],
    technologies: [
      "Mesh networking protocols",
      "Hardware-level encryption",
      "Distributed systems architecture",
      "Off-grid power integration",
    ],
  },
  {
    id: "heritage-alliance",
    name: "Heritage Alliance",
    logo: "/heritage-alliance-event.png",
    url: "https://example.com/heritage-alliance",
    category: "Organization",
    description:
      "Heritage Alliance works to preserve cultural traditions, historical knowledge, and community values through educational programs, events, and resources that connect generations and strengthen social bonds.",
    previewImage: "/people-gathering-rally.png",
    features: [
      "Cultural preservation programs",
      "Intergenerational mentoring",
      "Community event organizing",
      "Historical documentation projects",
    ],
    technologies: [
      "Digital archiving tools",
      "Community engagement platforms",
      "Event management systems",
      "Oral history recording technology",
    ],
  },
  {
    id: "liberty-college",
    name: "Liberty College",
    logo: "/liberty-college-students.png",
    url: "https://example.com/liberty-college",
    category: "Education",
    description:
      "Liberty College offers affordable, principle-based higher education focused on practical skills, critical thinking, and moral development. Their programs prepare students for meaningful careers while strengthening their values.",
    previewImage: "/modern-business-office.png",
    features: [
      "Skills-based degree programs",
      "Mentorship and apprenticeship",
      "Values-integrated curriculum",
      "Affordable tuition model",
    ],
    technologies: [
      "Hybrid learning platforms",
      "Skills assessment tools",
      "Peer learning networks",
      "Career placement systems",
    ],
  },
  {
    id: "abstract-tech",
    name: "Abstract Technologies",
    logo: "/abstract-logo.png",
    url: "https://example.com/abstract-tech",
    category: "Technology",
    description:
      "Abstract Technologies develops cutting-edge solutions for privacy-conscious users and organizations. Their products focus on data ownership, secure communications, and protection from surveillance.",
    previewImage: "/abstract-geometric-shapes.png",
    features: [
      "End-to-end encrypted collaboration tools",
      "Personal data vaults",
      "Anti-tracking browser technology",
      "Secure hardware development",
    ],
    technologies: [
      "Homomorphic encryption",
      "Secure multi-party computation",
      "Trustless protocols",
      "Hardware security modules",
    ],
  },
]
