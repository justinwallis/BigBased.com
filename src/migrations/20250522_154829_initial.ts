import type { MigrateUpArgs, MigrateDownArgs } from "@payloadcms/db-postgres"

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.db.schema.createTable("users", (table) => {
    table.increments("id").primary()
    table.string("email").unique().notNullable()
    table.string("password").notNullable()
    table.specificType("roles", "text[]").defaultTo("{user}")
    table.string("name")
    table.string("supabaseUserId")
    table.timestamp("createdAt").defaultTo(payload.db.fn.now())
    table.timestamp("updatedAt").defaultTo(payload.db.fn.now())
  })

  await payload.db.schema.createTable("pages", (table) => {
    table.increments("id").primary()
    table.string("title").notNullable()
    table.string("slug").unique().notNullable()
    table.jsonb("content")
    table.string("metaTitle")
    table.text("metaDescription")
    table.timestamp("publishedAt")
    table.string("status").defaultTo("draft")
    table.timestamp("createdAt").defaultTo(payload.db.fn.now())
    table.timestamp("updatedAt").defaultTo(payload.db.fn.now())
  })

  await payload.db.schema.createTable("posts", (table) => {
    table.increments("id").primary()
    table.string("title").notNullable()
    table.string("slug").unique().notNullable()
    table.jsonb("content")
    table.text("excerpt")
    table.integer("featuredImage")
    table.timestamp("publishedAt")
    table.string("status").defaultTo("draft")
    table.timestamp("createdAt").defaultTo(payload.db.fn.now())
    table.timestamp("updatedAt").defaultTo(payload.db.fn.now())
  })

  await payload.db.schema.createTable("media", (table) => {
    table.increments("id").primary()
    table.string("filename").notNullable()
    table.string("mimeType")
    table.integer("filesize")
    table.integer("width")
    table.integer("height")
    table.string("alt")
    table.string("url")
    table.timestamp("createdAt").defaultTo(payload.db.fn.now())
    table.timestamp("updatedAt").defaultTo(payload.db.fn.now())
  })

  // Create admin user
  await payload.create({
    collection: "users",
    data: {
      email: "admin@bigbased.com",
      password: "BigBased2024!",
      roles: ["admin"],
    },
  })
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  await payload.db.schema.dropTable("media")
  await payload.db.schema.dropTable("posts")
  await payload.db.schema.dropTable("pages")
  await payload.db.schema.dropTable("users")
}
