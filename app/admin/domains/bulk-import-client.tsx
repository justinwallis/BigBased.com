"use client"

import { useState } from "react"
import { bulkImportDomains, importFromCsvUrl, type BulkImportResult } from "@/app/actions/bulk-domain-actions"

interface BulkImportClientProps {
  onImportComplete: () => void
}

export default function BulkImportClient({ onImportComplete }: BulkImportClientProps) {
  const [isImporting, setIsImporting] = useState(false)
  const [importText, setImportText] = useState("")
  const [csvUrl, setCsvUrl] = useState("")
  const [result, setResult] = useState<BulkImportResult | null>(null)
  const [activeTab, setActiveTab] = useState<"text" | "url">("text")

  const handleTextImport = async () => {
    if (!importText.trim()) {
      alert("Please enter domains to import")
      return
    }

    setIsImporting(true)
    setResult(null)

    try {
      const importResult = await bulkImportDomains(importText)
      setResult(importResult)

      if (importResult.successCount > 0) {
        onImportComplete()
        setImportText("")
      }
    } catch (error: any) {
      console.error("Import error:", error)
      setResult({
        success: false,
        totalProcessed: 0,
        successCount: 0,
        errorCount: 1,
        errors: [{ domain: "import", error: error.message }],
        duplicates: [],
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleUrlImport = async () => {
    if (!csvUrl.trim()) {
      alert("Please enter a CSV URL")
      return
    }

    setIsImporting(true)
    setResult(null)

    try {
      const importResult = await importFromCsvUrl(csvUrl)
      setResult(importResult)

      if (importResult.successCount > 0) {
        onImportComplete()
        setCsvUrl("")
      }
    } catch (error: any) {
      console.error("Import error:", error)
      setResult({
        success: false,
        totalProcessed: 0,
        successCount: 0,
        errorCount: 1,
        errors: [{ domain: "import", error: error.message }],
        duplicates: [],
      })
    } finally {
      setIsImporting(false)
    }
  }

  const handleQuickImport = () => {
    setCsvUrl(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/domains-2025-06-06-234201-45J8XAy9w9xNzu7VVswXUEM1rO99ab.csv",
    )
    setActiveTab("url")
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Bulk Import Domains</h2>

        {/* Quick Import Button */}
        <div className="mb-4 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-900 mb-2">Quick Import Your CSV</h3>
          <p className="text-sm text-blue-700 mb-3">Import your uploaded domains CSV file directly</p>
          <button
            onClick={handleQuickImport}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Import Your Domains CSV
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "text" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === "url" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            CSV URL
          </button>
        </div>

        {/* Text Import Tab */}
        {activeTab === "text" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="importText" className="block text-sm font-medium text-gray-700 mb-2">
                Paste Domains (one per line or CSV format)
              </label>
              <textarea
                id="importText"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={`example.com
another-domain.org
third-domain.net

Or CSV format:
Domain
example.com
another-domain.org`}
              />
            </div>
            <button
              onClick={handleTextImport}
              disabled={isImporting || !importText.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {isImporting ? "Importing..." : "Import Domains"}
            </button>
          </div>
        )}

        {/* URL Import Tab */}
        {activeTab === "url" && (
          <div className="space-y-4">
            <div>
              <label htmlFor="csvUrl" className="block text-sm font-medium text-gray-700 mb-2">
                CSV File URL
              </label>
              <input
                type="url"
                id="csvUrl"
                value={csvUrl}
                onChange={(e) => setCsvUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com/domains.csv"
              />
            </div>
            <button
              onClick={handleUrlImport}
              disabled={isImporting || !csvUrl.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {isImporting ? "Importing..." : "Import from URL"}
            </button>
          </div>
        )}

        {/* Import Results */}
        {result && (
          <div className="mt-6 p-4 border rounded-md">
            <h3 className="font-semibold mb-3">Import Results</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{result.totalProcessed}</div>
                <div className="text-sm text-gray-600">Total Processed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{result.successCount}</div>
                <div className="text-sm text-gray-600">Successfully Added</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{result.duplicates.length}</div>
                <div className="text-sm text-gray-600">Duplicates Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{result.errorCount}</div>
                <div className="text-sm text-gray-600">Errors</div>
              </div>
            </div>

            {result.duplicates.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-yellow-700 mb-2">Duplicates Skipped ({result.duplicates.length})</h4>
                <div className="max-h-32 overflow-y-auto bg-yellow-50 p-2 rounded text-sm">
                  {result.duplicates.slice(0, 10).map((domain, index) => (
                    <div key={index} className="text-yellow-700">
                      {domain}
                    </div>
                  ))}
                  {result.duplicates.length > 10 && (
                    <div className="text-yellow-600 italic">... and {result.duplicates.length - 10} more</div>
                  )}
                </div>
              </div>
            )}

            {result.errors.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 mb-2">Errors ({result.errors.length})</h4>
                <div className="max-h-32 overflow-y-auto bg-red-50 p-2 rounded text-sm">
                  {result.errors.slice(0, 10).map((error, index) => (
                    <div key={index} className="text-red-700">
                      <span className="font-medium">{error.domain}:</span> {error.error}
                    </div>
                  ))}
                  {result.errors.length > 10 && (
                    <div className="text-red-600 italic">... and {result.errors.length - 10} more errors</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
