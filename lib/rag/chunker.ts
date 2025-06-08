import { RAG_CONFIG, type ContentChunk } from "./config"

export function chunkText(
  text: string,
  metadata: Omit<ContentChunk["metadata"], "section">,
): Omit<ContentChunk, "embedding">[] {
  const { maxChunkSize, overlap, minChunkSize } = RAG_CONFIG.chunking

  // Clean and normalize text
  const cleanText = text
    .replace(/<[^>]*>/g, " ") // Remove HTML tags
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()

  if (cleanText.length <= maxChunkSize) {
    return [
      {
        id: `${metadata.source_id}_chunk_0`,
        content: cleanText,
        metadata,
      },
    ]
  }

  const chunks: Omit<ContentChunk, "embedding">[] = []
  let start = 0
  let chunkIndex = 0

  while (start < cleanText.length) {
    let end = Math.min(start + maxChunkSize, cleanText.length)

    // Try to break at sentence boundaries
    if (end < cleanText.length) {
      const lastSentence = cleanText.lastIndexOf(".", end)
      const lastNewline = cleanText.lastIndexOf("\n", end)
      const breakPoint = Math.max(lastSentence, lastNewline)

      if (breakPoint > start + minChunkSize) {
        end = breakPoint + 1
      }
    }

    const chunkContent = cleanText.slice(start, end).trim()

    if (chunkContent.length >= minChunkSize) {
      chunks.push({
        id: `${metadata.source_id}_chunk_${chunkIndex}`,
        content: chunkContent,
        metadata: {
          ...metadata,
          section: `chunk_${chunkIndex}`,
        },
      })
      chunkIndex++
    }

    start = Math.max(start + maxChunkSize - overlap, end)
  }

  return chunks
}

// Specialized chunkers for different content types
export function chunkDocumentation(
  content: string,
  metadata: Omit<ContentChunk["metadata"], "section">,
): Omit<ContentChunk, "embedding">[] {
  // For documentation, try to split by headers first
  const headerSplit = content.split(/(?=^#{1,6}\s)/m)

  if (headerSplit.length > 1) {
    const chunks: Omit<ContentChunk, "embedding">[] = []

    headerSplit.forEach((section, index) => {
      if (section.trim()) {
        const sectionChunks = chunkText(section, {
          ...metadata,
          section: `section_${index}`,
        })
        chunks.push(...sectionChunks)
      }
    })

    return chunks
  }

  return chunkText(content, metadata)
}

export function chunkForumPost(
  content: string,
  metadata: Omit<ContentChunk["metadata"], "section">,
): Omit<ContentChunk, "embedding">[] {
  // For forum posts, keep them as single chunks unless very long
  if (content.length <= RAG_CONFIG.chunking.maxChunkSize * 1.5) {
    return [
      {
        id: `${metadata.source_id}_post`,
        content,
        metadata,
      },
    ]
  }

  return chunkText(content, metadata)
}
