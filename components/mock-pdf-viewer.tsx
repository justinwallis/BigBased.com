// components/mock-pdf-viewer.tsx

import type React from "react"

// Placeholder for PDF viewer - removed dependency on react-pdf
const Document = ({ children }: { children: React.ReactNode }) => <div>{children}</div>
const Page = ({ pageNumber }: { pageNumber: number }) => (
  <div className="pdf-page">Page {pageNumber} (PDF viewer placeholder)</div>
)

interface MockPdfViewerProps {
  numPages: number
}

const MockPdfViewer: React.FC<MockPdfViewerProps> = ({ numPages }) => {
  return (
    <Document>
      {Array.from({ length: numPages }, (_, index) => (
        <Page key={index + 1} pageNumber={index + 1} />
      ))}
    </Document>
  )
}

export default MockPdfViewer
