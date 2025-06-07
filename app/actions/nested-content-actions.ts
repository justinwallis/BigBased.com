"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { requireCMSPermission } from "@/lib/cms-access-control"
import { CMSErrorTracker } from "@/lib/sentry"

export interface ContentTreeNode {
  id: string
  title: string
  slug: string
  parent_id?: string
  depth: number
  path: string
  sort_order: number
  is_folder: boolean
  status: string
  content_type_name?: string
  children?: ContentTreeNode[]
}

export async function getContentTree(rootId?: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.rpc("get_content_tree", {
      root_id: rootId || null,
    })

    if (error) {
      CMSErrorTracker.trackContentError("get_content_tree", rootId || "root", new Error(error.message))
      return { success: false, error: error.message }
    }

    // Build tree structure
    const tree = buildTreeStructure(data || [])
    return { success: true, data: tree }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("get_content_tree", rootId || "root", error)
    return { success: false, error: error.message }
  }
}

function buildTreeStructure(flatData: any[]): ContentTreeNode[] {
  const nodeMap = new Map<string, ContentTreeNode>()
  const rootNodes: ContentTreeNode[] = []

  // First pass: create all nodes
  flatData.forEach((item) => {
    const node: ContentTreeNode = {
      id: item.id,
      title: item.title,
      slug: item.slug,
      parent_id: item.parent_id,
      depth: item.depth,
      path: item.path,
      sort_order: item.sort_order,
      is_folder: item.is_folder,
      status: item.status,
      content_type_name: item.content_type_name,
      children: [],
    }
    nodeMap.set(item.id, node)
  })

  // Second pass: build tree structure
  nodeMap.forEach((node) => {
    if (node.parent_id && nodeMap.has(node.parent_id)) {
      const parent = nodeMap.get(node.parent_id)!
      parent.children!.push(node)
    } else {
      rootNodes.push(node)
    }
  })

  // Sort children by sort_order
  const sortChildren = (nodes: ContentTreeNode[]) => {
    nodes.sort((a, b) => a.sort_order - b.sort_order)
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortChildren(node.children)
      }
    })
  }

  sortChildren(rootNodes)
  return rootNodes
}

export async function moveContentItem(itemId: string, newParentId?: string, newSortOrder?: number) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await requireCMSPermission(user.id, "content", "update")

    // Validate move operation (prevent circular references)
    if (newParentId) {
      const { data: descendants } = await supabase.from("content_items").select("id").like("path", `%.${itemId}.%`)

      if (descendants?.some((d) => d.id === newParentId)) {
        return { success: false, error: "Cannot move item to its own descendant" }
      }
    }

    // Update the item
    const { data, error } = await supabase
      .from("content_items")
      .update({
        parent_id: newParentId || null,
        sort_order: newSortOrder || 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", itemId)
      .select()
      .single()

    if (error) {
      CMSErrorTracker.trackContentError("move_content_item", itemId, new Error(error.message))
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms")
    return { success: true, data }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("move_content_item", itemId, error)
    return { success: false, error: error.message }
  }
}

export async function createFolder(name: string, parentId?: string) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await requireCMSPermission(user.id, "content", "create")

    // Get or create a "Folder" content type
    let { data: folderType } = await supabase.from("content_types").select("id").eq("slug", "folder").single()

    if (!folderType) {
      const { data: newFolderType, error: createError } = await supabase
        .from("content_types")
        .insert({
          name: "Folder",
          slug: "folder",
          description: "Content folder for organization",
          schema: {},
          settings: { is_system_type: true },
          created_by: user.id,
        })
        .select()
        .single()

      if (createError) {
        return { success: false, error: createError.message }
      }
      folderType = newFolderType
    }

    const { data, error } = await supabase
      .from("content_items")
      .insert({
        content_type_id: folderType.id,
        title: name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        content: {},
        status: "published",
        parent_id: parentId || null,
        is_folder: true,
        created_by: user.id,
        updated_by: user.id,
      })
      .select()
      .single()

    if (error) {
      CMSErrorTracker.trackContentError("create_folder", "new", new Error(error.message))
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/cms")
    return { success: true, data }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("create_folder", "new", error)
    return { success: false, error: error.message }
  }
}

export async function reorderContent(parentId: string | null, itemIds: string[]) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    await requireCMSPermission(user.id, "content", "update")

    // Update sort orders
    const updates = itemIds.map((id, index) => ({
      id,
      sort_order: index,
      updated_at: new Date().toISOString(),
    }))

    for (const update of updates) {
      await supabase.from("content_items").update(update).eq("id", update.id)
    }

    revalidatePath("/admin/cms")
    return { success: true }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("reorder_content", parentId || "root", error)
    return { success: false, error: error.message }
  }
}
