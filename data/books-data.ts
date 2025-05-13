// Book categories
export const bookCategories = [
  { id: "all", name: "All Books" },
  { id: "history", name: "History" },
  { id: "politics", name: "Politics" },
  { id: "economics", name: "Economics" },
  { id: "philosophy", name: "Philosophy" },
  { id: "religion", name: "Religion" },
  { id: "technology", name: "Technology" },
  { id: "culture", name: "Culture" },
]

// Sample PDF URLs - these are real, publicly available PDFs that work well with iframe embedding
const samplePDFs = [
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  "https://www.africau.edu/images/default/sample.pdf",
  "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-download-10-mb.pdf",
  "https://www.orimi.com/pdf-test.pdf",
  "https://www.clickdimensions.com/links/TestPDFfile.pdf",
  "https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/10/file-sample_150kB.pdf",
  "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf",
  "https://smallpdf.com/assets/img/file/pdf-sample-2.pdf",
  "https://smallpdf.com/assets/img/file/pdf-sample-3.pdf",
  "https://smallpdf.com/assets/img/file/pdf-sample.pdf",
]

// Book data
export const books = [
  {
    id: 1,
    title: "The Constitution: A Primer",
    author: "James Wilson",
    coverImage: "/constitution-primer-cover.png",
    pdfUrl: samplePDFs[0],
    description: "An essential guide to understanding the U.S. Constitution and its principles.",
    categories: ["history", "politics"],
    publishedYear: "2018",
    pages: 124,
    publisher: "Freedom Press",
  },
  {
    id: 2,
    title: "Digital Sovereignty",
    author: "Sarah Chen",
    coverImage: "/book-cover-digital-sovereignty.png",
    pdfUrl: samplePDFs[1],
    description: "How to reclaim your digital life from Big Tech surveillance and control.",
    categories: ["technology", "politics"],
    publishedYear: "2021",
    pages: 218,
    publisher: "Liberty Tech Publishing",
  },
  {
    id: 3,
    title: "Faith and Freedom",
    author: "Michael Thompson",
    coverImage: "/book-cover-faith-freedom.png",
    pdfUrl: samplePDFs[2],
    description: "Exploring the essential relationship between religious faith and political liberty.",
    categories: ["religion", "philosophy", "politics"],
    publishedYear: "2019",
    pages: 256,
    publisher: "Heritage Books",
  },
  {
    id: 4,
    title: "Free Market Principles",
    author: "Elizabeth Murray",
    coverImage: "/free-market-principles-cover.png",
    pdfUrl: samplePDFs[3],
    description: "A comprehensive guide to understanding free market economics and its benefits.",
    categories: ["economics", "politics"],
    publishedYear: "2020",
    pages: 184,
    publisher: "Prosperity Press",
  },
  {
    id: 5,
    title: "Cultural Resistance",
    author: "David Williams",
    coverImage: "/cultural-resistance-book-cover.png",
    pdfUrl: samplePDFs[4],
    description: "Strategies for preserving traditional values in a rapidly changing society.",
    categories: ["culture", "philosophy"],
    publishedYear: "2022",
    pages: 210,
    publisher: "Truth Network Publications",
  },
  {
    id: 6,
    title: "Founding Fathers' Vision",
    author: "Robert Johnson",
    coverImage: "/founding-fathers-vision-cover.png",
    pdfUrl: samplePDFs[5],
    description: "An in-depth look at the principles and vision of America's founding fathers.",
    categories: ["history", "politics"],
    publishedYear: "2017",
    pages: 298,
    publisher: "Patriot University Press",
  },
  {
    id: 7,
    title: "Decentralized Future",
    author: "Alex Rivera",
    coverImage: "/decentralized-future-book-cover.png",
    pdfUrl: samplePDFs[6],
    description: "How blockchain and decentralized technologies are reshaping society and governance.",
    categories: ["technology", "economics"],
    publishedYear: "2023",
    pages: 232,
    publisher: "Sovereign Systems Media",
  },
  {
    id: 8,
    title: "Western Philosophy",
    author: "Catherine Lewis",
    coverImage: "/western-philosophy-book-cover.png",
    pdfUrl: samplePDFs[7],
    description: "A survey of Western philosophical traditions and their impact on modern society.",
    categories: ["philosophy", "history"],
    publishedYear: "2019",
    pages: 342,
    publisher: "Liberty College Press",
  },
  {
    id: 9,
    title: "Christian Foundations",
    author: "Thomas Anderson",
    coverImage: "/christian-foundations-book-cover.png",
    pdfUrl: samplePDFs[8],
    description: "Exploring the core principles of Christianity and their relevance today.",
    categories: ["religion", "philosophy"],
    publishedYear: "2020",
    pages: 276,
    publisher: "Faith Publications",
  },
  {
    id: 10,
    title: "American Exceptionalism",
    author: "Jennifer Parker",
    coverImage: "/placeholder.svg?key=m30ah",
    pdfUrl: samplePDFs[9],
    description: "Understanding what makes America unique and its special role in world history.",
    categories: ["history", "politics", "culture"],
    publishedYear: "2021",
    pages: 224,
    publisher: "Freedom Foundation Press",
  },
]

// Generate placeholder book covers
export function getBookCoverUrl(bookId: number, title: string): string {
  return `/placeholder.svg?height=300&width=200&query=Book Cover: ${title}`
}

// Generate placeholder PDF URL
export function getPlaceholderPdfUrl(bookId: number): string {
  return `/placeholder-pdf-${bookId}.pdf`
}
