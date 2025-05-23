import type { Payload } from "payload"

export const seed = async (payload: Payload): Promise<void> => {
  // Create an admin user if there isn't one yet
  const existingAdmin = await payload.find({
    collection: "users",
    where: {
      email: {
        equals: "admin@example.com",
      },
    },
  })

  if (existingAdmin.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: {
        email: "admin@example.com",
        password: "password",
        roles: ["admin"],
      },
    })
  }
}
