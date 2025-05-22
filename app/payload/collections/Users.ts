import type { CollectionConfig } from "payload/types"

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    useAPIKey: true,
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "Editor",
          value: "editor",
        },
        {
          label: "User",
          value: "user",
        },
      ],
      defaultValue: ["user"],
    },
    {
      name: "supabaseUserId",
      type: "text",
      access: {
        read: ({ req }) => req.user?.roles?.includes("admin"),
        update: () => false,
      },
      admin: {
        position: "sidebar",
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        // If this is a new user being created via Supabase auth
        if (req.body && req.body.supabaseUserId) {
          data.supabaseUserId = req.body.supabaseUserId
        }
        return data
      },
    ],
  },
}
