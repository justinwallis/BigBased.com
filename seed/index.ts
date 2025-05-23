import payload from "payload"

const seed = async (): Promise<void> => {
  payload.logger.info("Starting seed script...")

  // Create admin user
  const adminUser = await payload.create({
    collection: "users",
    data: {
      email: "admin@bigbased.com",
      password: "BigBased2024!",
      name: "Big Based Admin",
      role: "admin",
    },
  })

  payload.logger.info(`Created admin user: ${adminUser.email}`)

  // Create sample pages
  const homePage = await payload.create({
    collection: "pages",
    data: {
      title: "Home",
      slug: "home",
      content: [
        {
          children: [
            {
              text: "Welcome to Big Based - the answer to madness in our modern world.",
            },
          ],
        },
      ],
      excerpt: "Big Based is a cultural revolution platform with a living library of truth, faith, and insight.",
      status: "published",
      seo: {
        title: "Big Based - Answer to Madness",
        description: "Big Based is a cultural revolution platform with a living library of truth, faith, and insight.",
        keywords: "big based, truth, faith, freedom, cultural revolution",
      },
    },
  })

  const aboutPage = await payload.create({
    collection: "pages",
    data: {
      title: "About Us",
      slug: "about",
      content: [
        {
          children: [
            {
              text: "Big Based is more than just a platform - it's a movement dedicated to preserving and promoting truth, faith, and freedom in an increasingly chaotic world.",
            },
          ],
        },
      ],
      excerpt: "Learn about our mission to restore truth and freedom.",
      status: "published",
      seo: {
        title: "About Big Based",
        description: "Learn about our mission to restore truth and freedom in the modern world.",
        keywords: "about, mission, truth, freedom, big based",
      },
    },
  })

  payload.logger.info(`Created pages: ${homePage.title}, ${aboutPage.title}`)

  // Create sample blog posts
  const post1 = await payload.create({
    collection: "posts",
    data: {
      title: "The Digital Revolution and Our Response",
      slug: "digital-revolution-response",
      content: [
        {
          children: [
            {
              text: "In an age of digital transformation, we must remain grounded in timeless principles while embracing technological advancement.",
            },
          ],
        },
      ],
      excerpt: "How we navigate the digital age while maintaining our core values.",
      author: adminUser.id,
      category: "technology",
      tags: "digital, technology, values, principles",
      status: "published",
      publishedAt: new Date().toISOString(),
      seo: {
        title: "The Digital Revolution and Our Response",
        description: "How we navigate the digital age while maintaining our core values.",
        keywords: "digital revolution, technology, values, principles",
      },
    },
  })

  const post2 = await payload.create({
    collection: "posts",
    data: {
      title: "Faith in the Modern World",
      slug: "faith-modern-world",
      content: [
        {
          children: [
            {
              text: "Exploring how traditional faith intersects with contemporary challenges and opportunities.",
            },
          ],
        },
      ],
      excerpt: "The role of faith in navigating modern complexities.",
      author: adminUser.id,
      category: "faith",
      tags: "faith, religion, modern world, spirituality",
      status: "published",
      publishedAt: new Date().toISOString(),
      seo: {
        title: "Faith in the Modern World",
        description: "The role of faith in navigating modern complexities.",
        keywords: "faith, religion, modern world, spirituality",
      },
    },
  })

  payload.logger.info(`Created posts: ${post1.title}, ${post2.title}`)

  payload.logger.info("Seed script completed successfully!")
}

export default seed
