import payload from "payload"
import path from "path"
import dotenv from "dotenv"

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../.env.local"),
})

export async function seed() {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "YOUR-SECRET-KEY-CHANGE-ME",
    local: true,
    onInit: async () => {
      payload.logger.info("Payload initialized")
    },
  })

  // Check if admin user exists
  const { docs: existingAdmins } = await payload.find({
    collection: "users",
    where: {
      roles: {
        contains: "admin",
      },
    },
  })

  if (existingAdmins.length === 0) {
    payload.logger.info("Creating admin user")

    await payload.create({
      collection: "users",
      data: {
        email: "admin@bigbased.com",
        password: "BigBased2024!",
        name: "Admin",
        roles: ["admin"],
      },
    })

    payload.logger.info("Admin user created successfully")
  } else {
    payload.logger.info("Admin user already exists")
  }

  // Create sample pages if they don't exist
  const { docs: existingPages } = await payload.find({
    collection: "pages",
    limit: 1,
  })

  if (existingPages.length === 0) {
    payload.logger.info("Creating sample pages")

    await payload.create({
      collection: "pages",
      data: {
        title: "Home",
        slug: "home",
        content: [
          {
            type: "paragraph",
            children: [
              {
                text: "Welcome to Big Based - your platform for digital sovereignty and cultural preservation.",
              },
            ],
          },
        ],
        status: "published",
      },
    })

    await payload.create({
      collection: "pages",
      data: {
        title: "About",
        slug: "about",
        content: [
          {
            type: "paragraph",
            children: [
              {
                text: "Learn more about our mission and values.",
              },
            ],
          },
        ],
        status: "published",
      },
    })

    payload.logger.info("Sample pages created successfully")
  } else {
    payload.logger.info("Pages already exist")
  }

  // Create sample blog posts if they don't exist
  const { docs: existingPosts } = await payload.find({
    collection: "posts",
    limit: 1,
  })

  if (existingPosts.length === 0) {
    payload.logger.info("Creating sample blog posts")

    await payload.create({
      collection: "posts",
      data: {
        title: "Digital Sovereignty in the Modern Age",
        slug: "digital-sovereignty",
        content: [
          {
            type: "paragraph",
            children: [
              {
                text: "Exploring the importance of digital sovereignty in today's interconnected world.",
              },
            ],
          },
        ],
        status: "published",
      },
    })

    await payload.create({
      collection: "posts",
      data: {
        title: "Building a Parallel Economy",
        slug: "parallel-economy",
        content: [
          {
            type: "paragraph",
            children: [
              {
                text: "How to contribute to and benefit from alternative economic systems.",
              },
            ],
          },
        ],
        status: "published",
      },
    })

    payload.logger.info("Sample blog posts created successfully")
  } else {
    payload.logger.info("Blog posts already exist")
  }
}

import mainSeed from "./index"

const runSeed = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    local: true,
  })

  try {
    await mainSeed()
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

runSeed()
