"use client"

import type React from "react"

import { useState, useRef } from "react"
import { createDomain, updateDomain, deleteDomain, type Domain } from "@/app/actions/domain-actions"
import BulkImportClient from "./bulk-import-client"
import { useRouter } from "next/navigation"

export default function DomainAdminClient({
  initialDomains,
}: {
  initialDomains: Domain[]
}) {
  const [domains, setDomains] = useState<Domain[]>(initialDomains)
  const [isCreating, setIsCreating] = useState(false)
  const [showBulkImport, setShowBulkImport] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const createFormRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await createDomain(formData)

      if (result.success && result.data) {
        setDomains([result.data, ...domains])
        setSuccess("Domain created successfully!")
        setIsCreating(false)

        // Safe form reset
        if (createFormRef.current) {
          createFormRef.current.reset()
        }
      } else {
        setError(result.error || "Failed to create domain")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>, domainId: string) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await updateDomain(domainId, formData)

      if (result.success && result.data) {
        setDomains(domains.map((d) => (d.id === domainId ? result.data : d)))
        setSuccess("Domain updated successfully!")
        setEditingDomain(null)
      } else {
        setError(result.error || "Failed to update domain")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (domainId: string) => {
    if (!window.confirm("Are you sure you want to delete this domain?")) {
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await deleteDomain(domainId)

      if (result.success) {
        setDomains(domains.filter((d) => d.id !== domainId))
        setSuccess("Domain deleted successfully!")
      } else {
        setError(result.error || "Failed to delete domain")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const handleImportComplete = () => {
    // Refresh the page to show newly imported domains
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Domain Management</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setShowBulkImport(!showBulkImport)
              clearMessages()
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            {showBulkImport ? "Hide Bulk Import" : "Bulk Import"}
          </button>
          <button
            onClick={() => {
              setIsCreating(!isCreating)
              clearMessages()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {isCreating ? "Cancel" : "Add Domain"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
              ×
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Bulk Import Section */}
      {showBulkImport && <BulkImportClient onImportComplete={handleImportComplete} />}

      {isCreating && (
        <div className="p-6 border rounded-md bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Add New Domain</h2>
          <form ref={createFormRef} onSubmit={handleCreateSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                  Domain Name
                </label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example.com"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  value="true"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false)
                    clearMessages()
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Domain"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden rounded-md">
        <div className="px-6 py-3 bg-gray-50 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Total Domains: {domains.length}</span>
            <span className="text-sm text-gray-500">
              Active: {domains.filter((d) => d.is_active).length} | Inactive:{" "}
              {domains.filter((d) => !d.is_active).length}
            </span>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Features
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {domains.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No domains found. Add your first domain above or use bulk import.
                </td>
              </tr>
            ) : (
              domains.map((domain) => (
                <tr key={domain.id}>
                  {editingDomain?.id === domain.id ? (
                    <td colSpan={5} className="px-6 py-4">
                      <form onSubmit={(e) => handleUpdateSubmit(e, domain.id)}>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="edit_domain" className="block text-sm font-medium text-gray-700">
                              Domain Name
                            </label>
                            <input
                              type="text"
                              id="edit_domain"
                              name="domain"
                              required
                              defaultValue={domain.domain}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="edit_is_active"
                              name="is_active"
                              value="true"
                              defaultChecked={domain.is_active}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="edit_is_active" className="ml-2 block text-sm text-gray-700">
                              Active
                            </label>
                          </div>

                          <div className="border-t pt-4 mt-4">
                            <h3 className="text-lg font-medium mb-2">Features</h3>
                            <div className="space-y-2">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="edit_enhanced_domains"
                                  name="enhanced_domains"
                                  value="true"
                                  defaultChecked={domain.custom_branding?.features?.enhanced_domains}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="edit_enhanced_domains" className="ml-2 block text-sm text-gray-700">
                                  Enhanced Domains
                                </label>
                              </div>

                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="edit_custom_branding"
                                  name="custom_branding"
                                  value="true"
                                  defaultChecked={domain.custom_branding?.features?.custom_branding}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="edit_custom_branding" className="ml-2 block text-sm text-gray-700">
                                  Custom Branding
                                </label>
                              </div>

                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id="edit_analytics"
                                  name="analytics"
                                  value="true"
                                  defaultChecked={domain.custom_branding?.features?.analytics}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="edit_analytics" className="ml-2 block text-sm text-gray-700">
                                  Analytics
                                </label>
                              </div>
                            </div>
                          </div>

                          {domain.custom_branding?.features?.custom_branding && (
                            <div className="border-t pt-4 mt-4">
                              <h3 className="text-lg font-medium mb-2">Branding</h3>
                              <div className="space-y-4">
                                <div>
                                  <label htmlFor="edit_logo_url" className="block text-sm font-medium text-gray-700">
                                    Logo URL
                                  </label>
                                  <input
                                    type="text"
                                    id="edit_logo_url"
                                    name="logo_url"
                                    defaultValue={domain.custom_branding?.logo_url || ""}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="edit_favicon_url" className="block text-sm font-medium text-gray-700">
                                    Favicon URL
                                  </label>
                                  <input
                                    type="text"
                                    id="edit_favicon_url"
                                    name="favicon_url"
                                    defaultValue={domain.custom_branding?.favicon_url || ""}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="edit_primary_color"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Primary Color
                                  </label>
                                  <input
                                    type="text"
                                    id="edit_primary_color"
                                    name="primary_color"
                                    defaultValue={domain.custom_branding?.primary_color || ""}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="#000000"
                                  />
                                </div>

                                <div>
                                  <label
                                    htmlFor="edit_secondary_color"
                                    className="block text-sm font-medium text-gray-700"
                                  >
                                    Secondary Color
                                  </label>
                                  <input
                                    type="text"
                                    id="edit_secondary_color"
                                    name="secondary_color"
                                    defaultValue={domain.custom_branding?.secondary_color || ""}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="#ffffff"
                                  />
                                </div>

                                <div>
                                  <label htmlFor="edit_custom_css" className="block text-sm font-medium text-gray-700">
                                    Custom CSS
                                  </label>
                                  <textarea
                                    id="edit_custom_css"
                                    name="custom_css"
                                    rows={4}
                                    defaultValue={domain.custom_branding?.custom_css || ""}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingDomain(null)
                                clearMessages()
                              }}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        </div>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{domain.domain}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            domain.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {domain.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {domain.custom_branding?.features?.enhanced_domains && (
                            <span className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                              Enhanced
                            </span>
                          )}
                          {domain.custom_branding?.features?.custom_branding && (
                            <span className="mr-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                              Branding
                            </span>
                          )}
                          {domain.custom_branding?.features?.analytics && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs">
                              Analytics
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(domain.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditingDomain(domain)
                            clearMessages()
                          }}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(domain.id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isSubmitting}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
