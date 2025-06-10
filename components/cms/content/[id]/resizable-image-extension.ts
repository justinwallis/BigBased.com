import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import ResizableImageComponent from "./resizable-image-component" // Assuming this component will be created next

export const ResizableImage = Node.create({
  name: "resizableImage",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.getAttribute("src"),
      },
      alt: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.getAttribute("alt"),
      },
      title: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.getAttribute("title"),
      },
      width: {
        default: "100%",
        parseHTML: (element) => element.querySelector("img")?.style.width,
      },
      height: {
        default: "auto",
        parseHTML: (element) => element.querySelector("img")?.style.height,
      },
      float: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.style.float,
      },
      display: {
        default: null,
        parseHTML: (element) => element.querySelector("img")?.style.display,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="resizable-image"]',
        contentElement: "img",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "resizable-image" }), ["img", HTMLAttributes]]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent)
  },
})
