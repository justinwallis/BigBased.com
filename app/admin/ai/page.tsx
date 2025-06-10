"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { BigBasedRAGSystem } from "@/lib/ai-rag-system" // Import the RAG system

function AiManagementClientComponent() {
  const [initStatus, setInitStatus] = useState("")
  const [indexDocId, setIndexDocId] = useState("")
  const [indexDocContent, setIndexDocContent] = useState("")
  const [indexDocTitle, setIndexDocTitle] = useState("")
  const [indexDocType, setIndexDocType] = useState("content")
  const [indexStatus, setIndexStatus] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searchStatus, setSearchStatus] = useState("")
  const [smartDomainKeywords, setSmartDomainKeywords] = useState("")
  const [smartDomainCount, setSmartDomainCount] = useState(3)
  const [smartDomains, setSmartDomains] = useState<string[]>([])
  const [smartDomainStatus, setSmartDomainStatus] = useState("")
  const [writingPrompt, setWritingPrompt] = useState("")
  const [writingLength, setWritingLength] = useState("medium")
  const [writingTone, setWritingTone] = useState("professional")
  const [generatedContent, setGeneratedContent] = useState("")
  const [writingStatus, setWritingStatus] = useState("")

  const ragSystem = new BigBasedRAGSystem() // Instantiate the RAG system

  const handleInitializeAI = async () => {
    setInitStatus("Initializing...")
    try {
      const response = await fetch("/api/chat/initialize", { method: "GET" }) // Corrected API path
      const data = await response.json()
      setInitStatus(data.message)
    } catch (error: any) {
      setInitStatus(`Error: ${error.message}`)
    }
  }

  const handleIndexDocument = async () => {
    setIndexStatus("Indexing...")
    try {
      const document = {
        id: indexDocId || `doc-${Date.now()}`,
        content: indexDocContent,
        metadata: {
          type: indexDocType,
          title: indexDocTitle,
          created_at: new Date().toISOString(),
        },
      }
      const response = await fetch("/api/chat/index-content", {
        // Corrected API path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document }),
      })
      const data = await response.json()
      setIndexStatus(data.message)
    } catch (error: any) {
      setIndexStatus(`Error: ${error.message}`)
    }
  }

  const handleSearchAI = async () => {
    setSearchStatus("Searching...")
    try {
      const response = await fetch("/api/chat/search", {
        // Corrected API path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })
      const data = await response.json()
      setSearchResults(data.results)
      setSearchStatus("Search complete.")
    } catch (error: any) {
      setSearchStatus(`Error: ${error.message}`)
    }
  }

  const handleGenerateSmartDomains = async () => {
    setSmartDomainStatus("Generating...")
    try {
      const keywordsArray = smartDomainKeywords.split(",").map((k) => k.trim())
      const response = await fetch("/api/chat/smart-domains", {
        // Corrected API path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: keywordsArray, count: smartDomainCount }),
      })
      const data = await response.json()
      setSmartDomains(data.domains)
      setSmartDomainStatus("Domains generated.")
    } catch (error: any) {
      setSmartDomainStatus(`Error: ${error.message}`)
    }
  }

  const handleGenerateWriting = async () => {
    setWritingStatus("Generating...")
    try {
      const response = await fetch("/api/chat/writing-assistant", {
        // Corrected API path
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: writingPrompt, length: writingLength, tone: writingTone }),
      })
      const data = await response.json()
      setGeneratedContent(data.content)
      setWritingStatus("Content generated.")
    } catch (error: any) {
      setWritingStatus(`Error: ${error.message}`)
    }
  }

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Initialize AI System</CardTitle>
          <CardDescription>Ensure Qdrant collections are set up.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleInitializeAI}>Initialize</Button>
          {initStatus && <p className="mt-2 text-sm">{initStatus}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Index Document</CardTitle>
          <CardDescription>Add content to the RAG system.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="index-doc-id">Document ID (Optional)</Label>
            <Input id="index-doc-id" value={indexDocId} onChange={(e) => setIndexDocId(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="index-doc-title">Document Title</Label>
            <Input id="index-doc-title" value={indexDocTitle} onChange={(e) => setIndexDocTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="index-doc-type">Document Type</Label>
            <Input id="index-doc-type" value={indexDocType} onChange={(e) => setIndexDocType(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="index-doc-content">Content</Label>
            <Textarea
              id="index-doc-content"
              value={indexDocContent}
              onChange={(e) => setIndexDocContent(e.target.value)}
              rows={5}
            />
          </div>
          <Button onClick={handleIndexDocument}>Index Document</Button>
          {indexStatus && <p className="mt-2 text-sm">{indexStatus}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search AI</CardTitle>
          <CardDescription>Search for relevant documents in the RAG system.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="search-query">Search Query</Label>
            <Input id="search-query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <Button onClick={handleSearchAI}>Search</Button>
          {searchStatus && <p className="mt-2 text-sm">{searchStatus}</p>}
          {searchResults.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Results:</h4>
              <ul className="list-disc pl-5 text-sm">
                {searchResults.map((result, index) => (
                  <li key={index}>
                    <strong>{result.document.metadata.title}</strong> (Score: {result.score.toFixed(2)})
                    <p className="text-gray-600 line-clamp-2">{result.document.content}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generate Smart Domains</CardTitle>
          <CardDescription>Generate domain name suggestions based on keywords.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="smart-domain-keywords">Keywords (comma-separated)</Label>
            <Input
              id="smart-domain-keywords"
              value={smartDomainKeywords}
              onChange={(e) => setSmartDomainKeywords(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="smart-domain-count">Number of Domains</Label>
            <Input
              id="smart-domain-count"
              type="number"
              value={smartDomainCount}
              onChange={(e) => setSmartDomainCount(Number.parseInt(e.target.value))}
              min={1}
              max={10}
            />
          </div>
          <Button onClick={handleGenerateSmartDomains}>Generate Domains</Button>
          {smartDomainStatus && <p className="mt-2 text-sm">{smartDomainStatus}</p>}
          {smartDomains.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">Generated Domains:</h4>
              <ul className="list-disc pl-5 text-sm">
                {smartDomains.map((domain, index) => (
                  <li key={index}>{domain}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Writing Assistant</CardTitle>
          <CardDescription>Generate content based on a prompt.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="writing-prompt">Prompt</Label>
            <Textarea
              id="writing-prompt"
              value={writingPrompt}
              onChange={(e) => setWritingPrompt(e.target.value)}
              rows={5}
            />
          </div>
          <div>
            <Label htmlFor="writing-length">Length</Label>
            <select
              id="writing-length"
              value={writingLength}
              onChange={(e) => setWritingLength(e.target.value)}
              className="block w-full p-2 border rounded-md"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
          <div>
            <Label htmlFor="writing-tone">Tone</Label>
            <select
              id="writing-tone"
              value={writingTone}
              onChange={(e) => setWritingTone(e.target.value)}
              className="block w-full p-2 border rounded-md"
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
            </select>
          </div>
          <Button onClick={handleGenerateWriting}>Generate Content</Button>
          {writingStatus && <p className="mt-2 text-sm">{writingStatus}</p>}
          {generatedContent && (
            <div className="mt-4">
              <h4 className="font-semibold">Generated Content:</h4>
              <Textarea value={generatedContent} readOnly rows={10} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function AiAdminPage() {
  return <AiManagementClientComponent />
}
