import type React from "react"
// Placeholder for PDF viewer - removed dependency on react-pdf
const Document = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const Page = ({ pageNumber }: { pageNumber: number }) => (
  <div className="pdf-page">Page {pageNumber} (PDF viewer placeholder)</div>
)

const FallbackPdfViewer = () => {
  return (
    <div>
      <Document>
        <Page pageNumber={1} />
        <Page pageNumber={2} />
        <Page pageNumber={3} />
      </Document>
    </div>
  )
}

export default FallbackPdfViewer
