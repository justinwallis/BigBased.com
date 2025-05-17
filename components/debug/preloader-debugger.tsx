"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle, Info, RefreshCw } from "lucide-react"

export default function PreloaderDebugger() {
  const [preloaderState, setPreloaderState] = useState({
    initialPreloaderExists: false,
    initialPreloaderActive: false,
    reactPreloaderActive: false,
    loadingManagerResources: {},
    loadingManagerProgress: 0,
  })

  const refreshState = () => {
    const state = {
      initialPreloaderExists: !!window.initialPreloader,
      initialPreloaderActive: !!window.initialPreloaderActive,
      reactPreloaderActive: document.querySelector('[class*="preloader"]') !== null,
      loadingManagerResources: window.resourceStatus || {},
      loadingManagerProgress: window.resourcesLoaded
        ? Math.floor((window.resourcesLoaded / window.totalResources) * 100)
        : 0,
    }
    setPreloaderState(state)
  }

  useEffect(() => {
    refreshState()
    const interval = setInterval(refreshState, 1000)
    return () => clearInterval(interval)
  }, [])

  const forceRemovePreloaders = () => {
    // Remove initial preloader
    if (window.initialPreloader && window.initialPreloader.parentNode) {
      window.initialPreloader.parentNode.removeChild(window.initialPreloader)
    }

    // Remove any React preloaders
    const preloaders = document.querySelectorAll('[class*="preloader"]')
    preloaders.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    })

    // Clear any intervals
    for (let i = 0; i < 1000; i++) {
      window.clearInterval(i)
      window.clearTimeout(i)
    }

    // Reset flags
    window.initialPreloaderActive = false

    // Refresh state
    refreshState()
  }

  const resetLoadingManager = () => {
    if (window.loadingManager && window.loadingManager.reset) {
      window.loadingManager.reset()
    } else {
      window.resourceStatus = {}
      window.totalResources = 0
      window.resourcesLoaded = 0
    }
    refreshState()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Preloader Debugger
            <Button size="sm" variant="outline" className="ml-auto" onClick={refreshState}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>Diagnose and fix preloader issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Initial Preloader Exists:</span>
                <Badge variant={preloaderState.initialPreloaderExists ? "destructive" : "success"}>
                  {preloaderState.initialPreloaderExists ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Initial Preloader Active:</span>
                <Badge variant={preloaderState.initialPreloaderActive ? "destructive" : "success"}>
                  {preloaderState.initialPreloaderActive ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">React Preloader Active:</span>
                <Badge variant={preloaderState.reactPreloaderActive ? "destructive" : "success"}>
                  {preloaderState.reactPreloaderActive ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Loading Manager Progress:</span>
                <Badge variant="outline">{preloaderState.loadingManagerProgress}%</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" onClick={forceRemovePreloaders}>
                Force Remove All Preloaders
              </Button>
              <Button className="w-full" variant="outline" onClick={resetLoadingManager}>
                Reset Loading Manager
              </Button>
              <Button className="w-full" variant="secondary" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>

          <Tabs defaultValue="resources">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="resources">Loading Resources</TabsTrigger>
              <TabsTrigger value="actions">Troubleshooting</TabsTrigger>
            </TabsList>
            <TabsContent value="resources" className="space-y-4">
              <div className="mt-4 border rounded-md p-4">
                <h3 className="font-medium mb-2">Registered Resources:</h3>
                <div className="space-y-2">
                  {Object.entries(preloaderState.loadingManagerResources).length > 0 ? (
                    Object.entries(preloaderState.loadingManagerResources).map(([id, resource]: [string, any]) => (
                      <div key={id} className="flex items-center justify-between">
                        <span>{id}:</span>
                        <Badge
                          variant={
                            resource.status === "loaded"
                              ? "success"
                              : resource.status === "error"
                                ? "destructive"
                                : "outline"
                          }
                        >
                          {resource.status} (weight: {resource.weight})
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 italic">No resources registered</div>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="actions" className="space-y-4">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Common Issues:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Double Preloaders</p>
                      <p className="text-sm text-gray-500">
                        If you see both initial and React preloaders active, use the "Force Remove All Preloaders"
                        button.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Stuck Loading Resources</p>
                      <p className="text-sm text-gray-500">
                        If resources are stuck loading, use "Reset Loading Manager" and reload the page.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Debug Mode</p>
                      <p className="text-sm text-gray-500">
                        Add ?debug=true to any URL to enable debug mode, which will log preloader events to the console.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
