export type FAQItem = {
  question: string
  answer: string
  category?: string
}

export const faqItems: FAQItem[] = [
  {
    question: "What is Big Based?",
    answer:
      "Big Based is a cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy based on freedom and responsibility. It's not just a platform, but a movement that provides tools, knowledge, and community for those seeking to break free from manipulation and censorship.",
    category: "general",
  },
  {
    question: "What does 'Based' mean?",
    answer:
      "'Based' refers to having opinions without regard for mainstream or conventional thinking. It represents authenticity, courage, and standing firm in one's convictions despite opposition. Big Based embodies this principle by promoting truth and freedom in a world increasingly dominated by censorship and control.",
    category: "general",
  },
  {
    question: "How is Big Based different from other platforms?",
    answer:
      "Big Based stands apart through its comprehensive approach to cultural transformation. Unlike platforms that merely offer content or community, we provide a holistic ecosystem that includes educational resources, community connections, digital tools, and economic alternatives—all aligned with principles of truth, faith, and freedom.",
    category: "general",
  },
  {
    question: "Is Big Based affiliated with any political party?",
    answer:
      "Big Based is not formally affiliated with any political party. We are a values-based movement that promotes principles of freedom, truth, faith, and sovereignty. While these values may align with certain political perspectives, our mission transcends partisan politics to focus on cultural and spiritual renewal.",
    category: "general",
  },
  {
    question: "How can I join Big Based?",
    answer:
      "You can join Big Based by creating an account on our platform. This gives you access to our digital library, community forums, and various resources. For deeper involvement, you can participate in our events, contribute content, or support our mission financially through donations or subscriptions.",
    category: "membership",
  },
  {
    question: "Is there a cost to join Big Based?",
    answer:
      "Basic access to Big Based is free, allowing you to explore our platform and access fundamental resources. We also offer premium membership tiers that provide enhanced features, exclusive content, and additional support for those who wish to deepen their engagement with our mission.",
    category: "membership",
  },
  {
    question: "What resources does Big Based offer?",
    answer:
      "Big Based offers a comprehensive digital library with over 10,000+ meticulously researched pages covering topics from faith and freedom to digital sovereignty and cultural resistance. We also provide practical guides, video content, community forums, educational courses, and tools for building alternative systems.",
    category: "resources",
  },
  {
    question: "How does Big Based support digital sovereignty?",
    answer:
      "We support digital sovereignty through education about privacy tools, promotion of decentralized technologies, development of censorship-resistant platforms, and building networks that operate independently of Big Tech control. We empower individuals and communities to reclaim ownership of their digital presence and data.",
    category: "mission",
  },
  {
    question: "What is the 'parallel economy' that Big Based promotes?",
    answer:
      "The parallel economy refers to alternative economic systems and networks that operate according to principles of freedom, fair exchange, and human dignity. Big Based promotes this by connecting freedom-minded businesses, encouraging local commerce, exploring alternative currencies, and supporting economic models that resist centralized control and manipulation.",
    category: "mission",
  },
  {
    question: "How is faith integrated into Big Based's mission?",
    answer:
      "Faith is a foundational element of Big Based's mission. We recognize that spiritual principles provide essential guidance for cultural renewal and human flourishing. Our resources include faith-based perspectives on contemporary issues, and we affirm the importance of religious liberty as a cornerstone of a free society.",
    category: "mission",
  },
  {
    question: "Can organizations partner with Big Based?",
    answer:
      "Yes, we actively seek partnerships with organizations that share our values and mission. Whether you're a business, educational institution, church, or nonprofit, we offer various collaboration opportunities. Partners can contribute to our resource library, participate in our events, or join our network of freedom-minded organizations.",
    category: "partnerships",
  },
  {
    question: "How can I contribute content to Big Based?",
    answer:
      "We welcome content contributions from individuals aligned with our mission. You can submit articles, videos, research papers, or other resources through our content submission process. All submissions undergo review to ensure quality and alignment with our values before being published on our platform.",
    category: "contribution",
  },
]

export const getFAQsByCategory = (category?: string) => {
  if (!category) return faqItems
  return faqItems.filter((item) => item.category === category)
}
