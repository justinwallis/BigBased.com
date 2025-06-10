import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createLowlight } from "lowlight"
import { common, createStarryNight } from "@wooorm/starry-night"
import { toHtml } from "hast-util-to-html"
import { toMdast } from "hast-to-mdast"
import { fromHtml } from "hast-util-from-html"
import { defaultHandlers } from "mdast-util-to-hast"
import { defaultSchema } from "@tiptap/html"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { ResizableImage } from "@/components/cms/content/[id]/resizable-image-extension" // Corrected import path

// Initialize lowlight for code blocks
const lowlight = createLowlight(common)

// Initialize Starry Night for syntax highlighting
let starryNight: any
createStarryNight(common).then((sn) => {
  starryNight = sn
})

export const editorExtensions = [
  StarterKit.configure({
    codeBlock: false, // Disable default codeBlock to use CodeBlockLowlight
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  TextStyle,
  Color,
  Highlight.configure({
    multicolor: true,
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    linkOnPaste: true,
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
  }),
  ResizableImage, // Custom resizable image extension
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "What is the title?"
      }
      return "Can you add some content?"
    },
  }),
  CharacterCount.configure({
    limit: 10000,
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  CodeBlockLowlight.configure({
    lowlight,
    defaultLanguage: "auto",
  }),
]

export function htmlToJson(html: string) {
  if (!html) return {}
  const mdast = toMdast(fromHtml(html, { fragment: true }), {
    handlers: {
      ...defaultHandlers,
      // Add custom handlers if needed for specific HTML elements
    },
  })
  return mdast // Tiptap expects a ProseMirror JSON, but for simplicity, we'll return mdast
}

export function jsonToHtml(json: any) {
  if (!json) return ""
  // Assuming json is mdast, convert it to hast first
  const hast = defaultHandlers.root(json, defaultSchema)
  return toHtml(hast)
}

// AI-powered content generation (example, can be expanded)
export async function generateAIContent(prompt: string) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Generate a detailed and well-structured article based on the following prompt: ${prompt}.
    Ensure the content is informative, engaging, and adheres to conservative principles.`,
    temperature: 0.7,
    maxTokens: 2000,
  })
  return text
}

// AI-powered content summarization
export async function summarizeContent(content: string) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Summarize the following content concisely, focusing on key points and conservative relevance:
    ${content}`,
    temperature: 0.5,
    maxTokens: 500,
  })
  return text
}

// AI-powered SEO optimization
export async function optimizeSEO(content: string, title: string) {
  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    prompt: `Analyze the following content and title to suggest SEO improvements.
    Content: ${content}
    Title: ${title}
    
    Provide:
    - Optimized Title (if needed)
    - Meta Description (150-160 characters)
    - Relevant Keywords (comma-separated)
    - Suggestions for content improvement for SEO
    
    Format as JSON: { optimizedTitle: string, metaDescription: string, keywords: string[], suggestions: string }`,
    temperature: 0.6,
  })
  return JSON.parse(text)
}
