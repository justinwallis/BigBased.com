"use client"

import type React from "react"
import { useState } from "react"
import { updateDomain, type Domain } from "@/app/actions/domain-actions"

interface DomainConfigClientProps {
  domain: Domain
  onUpdate: (updatedDomain: Domain) => void
  onCancel: () => void
}

export default function DomainConfigClient({ domain, onUpdate, onCancel }: DomainConfigClientProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [config, setConfig] = useState({
    domain: domain.domain,
    is_active: domain.is_active,
    site_name: domain.custom_branding?.site_name || "",
    tagline: domain.custom_branding?.tagline || "",
    meta_description: domain.custom_branding?.meta_description || "",
    logo_url: domain.custom_branding?.logo_url || "",
    favicon_url: domain.custom_branding?.favicon_url || "",
    primary_color: domain.custom_branding?.primary_color || "#000000",
    secondary_color: domain.custom_branding?.secondary_color || "#ffffff",
    custom_css: domain.custom_branding?.custom_css || "",

    // Features
    enhanced_domains: domain.custom_branding?.features?.enhanced_domains || false,
    custom_branding: domain.custom_branding?.features?.custom_branding || false,
    analytics: domain.custom_branding?.features?.analytics || false,
    custom_navigation: domain.custom_branding?.features?.custom_navigation || false,
    domain_specific_content: domain.custom_branding?.features?.domain_specific_content || false,
    seo_optimization: domain.custom_branding?.features?.seo_optimization || false,

    // Settings
    theme: domain.custom_branding?.settings?.theme || "auto",
    language: domain.custom_branding?.settings?.language || "en",
    timezone: domain.custom_branding?.settings?.timezone || "UTC",
    currency: domain.custom_branding?.settings?.currency || "USD",
    enable_comments: domain.custom_branding?.settings?.enable_comments || true,
    enable_social_sharing: domain.custom_branding?.settings?.enable_social_sharing || true,
    enable_newsletter: domain.custom_branding?.settings?.enable_newsletter || false,
    enable_search: domain.custom_branding?.settings?.enable_search || true,
    maintenance_mode: domain.custom_branding?.settings?.maintenance_mode || false,
    custom_footer: domain.custom_branding?.settings?.custom_footer || "",
    custom_header: domain.custom_branding?.settings?.custom_header || "",

    // Analytics
    google_analytics_id: domain.custom_branding?.analytics?.google_analytics_id || "",
    facebook_pixel_id: domain.custom_branding?.analytics?.facebook_pixel_id || "",
    custom_tracking_code: domain.custom_branding?.analytics?.custom_tracking_code || "",
    enable_heatmaps: domain.custom_branding?.analytics?.enable_heatmaps || false,
    enable_session_recording: domain.custom_branding?.analytics?.enable_session_recording || false,

    // Social
    facebook_url: domain.custom_branding?.social?.facebook_url || "",
    twitter_url: domain.custom_branding?.social?.twitter_url || "",
    instagram_url: domain.custom_branding?.social?.instagram_url || "",
    linkedin_url: domain.custom_branding?.social?.linkedin_url || "",
    youtube_url: domain.custom_branding?.social?.youtube_url || "",

    // Content
    homepage_layout: domain.custom_branding?.content?.homepage_layout || "default",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData()

      // Basic fields
      formData.append("domain", config.domain)
      formData.append("is_active", config.is_active.toString())

      // Branding fields
      formData.append("site_name", config.site_name)
      formData.append("tagline", config.tagline)
      formData.append("meta_description", config.meta_description)
      formData.append("logo_url", config.logo_url)
      formData.append("favicon_url", config.favicon_url)
      formData.append("primary_color", config.primary_color)
      formData.append("secondary_color", config.secondary_color)
      formData.append("custom_css", config.custom_css)

      // Features
      formData.append("enhanced_domains", config.enhanced_domains.toString())
      formData.append("custom_branding", config.custom_branding.toString())
      formData.append("analytics", config.analytics.toString())
      formData.append("custom_navigation", config.custom_navigation.toString())
      formData.append("domain_specific_content", config.domain_specific_content.toString())
      formData.append("seo_optimization", config.seo_optimization.toString())

      // Settings
      formData.append("theme", config.theme)
      formData.append("language", config.language)
      formData.append("timezone", config.timezone)
      formData.append("currency", config.currency)
      formData.append("enable_comments", config.enable_comments.toString())
      formData.append("enable_social_sharing", config.enable_social_sharing.toString())
      formData.append("enable_newsletter", config.enable_newsletter.toString())
      formData.append("enable_search", config.enable_search.toString())
      formData.append("maintenance_mode", config.maintenance_mode.toString())
      formData.append("custom_footer", config.custom_footer)
      formData.append("custom_header", config.custom_header)

      // Analytics
      formData.append("google_analytics_id", config.google_analytics_id)
      formData.append("facebook_pixel_id", config.facebook_pixel_id)
      formData.append("custom_tracking_code", config.custom_tracking_code)
      formData.append("enable_heatmaps", config.enable_heatmaps.toString())
      formData.append("enable_session_recording", config.enable_session_recording.toString())

      // Social
      formData.append("facebook_url", config.facebook_url)
      formData.append("twitter_url", config.twitter_url)
      formData.append("instagram_url", config.instagram_url)
      formData.append("linkedin_url", config.linkedin_url)
      formData.append("youtube_url", config.youtube_url)

      // Content
      formData.append("homepage_layout", config.homepage_layout)

      const result = await updateDomain(domain.id, formData)

      if (result.success && result.data) {
        setSuccess("Domain configuration updated successfully!")
        onUpdate(result.data)
      } else {
        setError(result.error || "Failed to update domain configuration")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Configure Domain: {domain.domain}</h2>
        <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition">
          ← Back to Domains
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">{error}</div>}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Settings */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Basic Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
              <input
                type="text"
                value={config.domain}
                onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={config.is_active}
                onChange={(e) => setConfig({ ...config, is_active: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                Domain Active
              </label>
            </div>
          </div>
        </div>

        {/* Site Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Site Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
              <input
                type="text"
                value={config.site_name}
                onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Awesome Site"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                value={config.tagline}
                onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your site's tagline"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
              <textarea
                value={config.meta_description}
                onChange={(e) => setConfig({ ...config, meta_description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A brief description of your site for search engines"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "enhanced_domains", label: "Enhanced Domains", description: "Multi-tenant functionality" },
              { key: "custom_branding", label: "Custom Branding", description: "Personalized appearance" },
              { key: "analytics", label: "Analytics", description: "Track performance" },
              { key: "custom_navigation", label: "Custom Navigation", description: "Domain-specific menus" },
              { key: "domain_specific_content", label: "Domain Content", description: "Unique content per domain" },
              { key: "seo_optimization", label: "SEO Optimization", description: "Search engine optimization" },
            ].map((feature) => (
              <div key={feature.key} className="flex items-start space-x-3 p-3 border rounded-md">
                <input
                  type="checkbox"
                  id={feature.key}
                  checked={config[feature.key as keyof typeof config] as boolean}
                  onChange={(e) => setConfig({ ...config, [feature.key]: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <label htmlFor={feature.key} className="text-sm font-medium text-gray-700">
                    {feature.label}
                  </label>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branding */}
        {config.custom_branding && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
                <input
                  type="url"
                  value={config.logo_url}
                  onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Favicon URL</label>
                <input
                  type="url"
                  value={config.favicon_url}
                  onChange={(e) => setConfig({ ...config, favicon_url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={config.primary_color}
                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                    className="h-10 w-16 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={config.primary_color}
                    onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={config.secondary_color}
                    onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                    className="h-10 w-16 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={config.secondary_color}
                    onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#ffffff"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom CSS</label>
                <textarea
                  value={config.custom_css}
                  onChange={(e) => setConfig({ ...config, custom_css: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="/* Custom CSS for this domain */"
                />
              </div>
            </div>
          </div>
        )}

        {/* Site Settings */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Site Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select
                value={config.theme}
                onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="auto">Auto</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={config.language}
                onChange={(e) => setConfig({ ...config, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={config.currency}
                onChange={(e) => setConfig({ ...config, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "enable_comments", label: "Enable Comments" },
              { key: "enable_social_sharing", label: "Enable Social Sharing" },
              { key: "enable_newsletter", label: "Enable Newsletter" },
              { key: "enable_search", label: "Enable Search" },
              { key: "maintenance_mode", label: "Maintenance Mode" },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={setting.key}
                  checked={config[setting.key as keyof typeof config] as boolean}
                  onChange={(e) => setConfig({ ...config, [setting.key]: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={setting.key} className="text-sm text-gray-700">
                  {setting.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        {config.analytics && (
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4">Analytics & Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
                <input
                  type="text"
                  value={config.google_analytics_id}
                  onChange={(e) => setConfig({ ...config, google_analytics_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="GA-XXXXXXXXX-X"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
                <input
                  type="text"
                  value={config.facebook_pixel_id}
                  onChange={(e) => setConfig({ ...config, facebook_pixel_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123456789012345"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Custom Tracking Code</label>
                <textarea
                  value={config.custom_tracking_code}
                  onChange={(e) => setConfig({ ...config, custom_tracking_code: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder="<!-- Custom tracking code -->"
                />
              </div>
              <div className="md:col-span-2 flex space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable_heatmaps"
                    checked={config.enable_heatmaps}
                    onChange={(e) => setConfig({ ...config, enable_heatmaps: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_heatmaps" className="text-sm text-gray-700">
                    Enable Heatmaps
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enable_session_recording"
                    checked={config.enable_session_recording}
                    onChange={(e) => setConfig({ ...config, enable_session_recording: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable_session_recording" className="text-sm text-gray-700">
                    Enable Session Recording
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Social Media */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Social Media</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={config.facebook_url}
                onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/yourpage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter URL</label>
              <input
                type="url"
                value={config.twitter_url}
                onChange={(e) => setConfig({ ...config, twitter_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/youraccount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={config.instagram_url}
                onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/youraccount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={config.linkedin_url}
                onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
              <input
                type="url"
                value={config.youtube_url}
                onChange={(e) => setConfig({ ...config, youtube_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://youtube.com/c/yourchannel"
              />
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Content Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Homepage Layout</label>
              <select
                value={config.homepage_layout}
                onChange={(e) => setConfig({ ...config, homepage_layout: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">Default</option>
                <option value="landing">Landing Page</option>
                <option value="blog">Blog Style</option>
                <option value="portfolio">Portfolio</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Header</label>
              <textarea
                value={config.custom_header}
                onChange={(e) => setConfig({ ...config, custom_header: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Custom header content or HTML"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custom Footer</label>
              <textarea
                value={config.custom_footer}
                onChange={(e) => setConfig({ ...config, custom_footer: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Custom footer content or HTML"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>
    </div>
  )
}
