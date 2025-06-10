import { Extension } from "@tiptap/core"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import Underline from "@tiptap/extension-underline"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { lowlight } from "lowlight" // Corrected import for lowlight

// Custom extension for handling media embeds
export const MediaEmbed = Extension.create({
  name: "mediaEmbed",

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: "auto",
      },
      type: {
        default: "image", // image, video, iframe
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div[data-media-embed]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", { "data-media-embed": "", ...HTMLAttributes }]
  },
})

// Define the extensions for the editor
export const editorExtensions = [
  StarterKit,
  Highlight,
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: "text-primary underline",
    },
  }),
  Image.configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-md max-w-full",
    },
  }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableCell,
  TableHeader,
  Underline,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  MediaEmbed,
]

// Helper function to convert HTML to JSON for storage
export function htmlToJson(html: string) {
  return {
    html,
    // Additional metadata could be extracted here
    plainText: html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  }
}

// Helper function to convert JSON to HTML for display
export function jsonToHtml(json: any) {
  if (!json) return ""
  if (typeof json === "string") return json
  return json.html || ""
}
