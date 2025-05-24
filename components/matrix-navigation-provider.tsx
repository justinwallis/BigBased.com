"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react"
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom"

interface MatrixNavigationContextProps {
  navigateTo: (path: string, options?: NavigateOptions) => void
  currentPath: string
  params: Readonly<Params<string>>
  searchParams: URLSearchParams
  goBack: () => void
  goForward: () => void
}

interface NavigateOptions {
  replace?: boolean
  state?: any
}

interface MatrixNavigationProviderProps {
  children: ReactNode
  authPageExclusions?: string[]
}

const MatrixNavigationContext = createContext<MatrixNavigationContextProps | undefined>(undefined)

export const useMatrixNavigation = (): MatrixNavigationContextProps => {
  const context = useContext(MatrixNavigationContext)
  if (!context) {
    throw new Error("useMatrixNavigation must be used within a MatrixNavigationProvider")
  }
  return context
}

export const MatrixNavigationProvider: React.FC<MatrixNavigationProviderProps> = ({
  children,
  authPageExclusions = [],
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()
  const [searchParams] = useSearchParams()
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location])

  const navigateTo = useCallback(
    (path: string, options: NavigateOptions = {}) => {
      const { replace = false, state } = options

      const currentPathIsAuth = authPageExclusions.some((exclusion) => location.pathname.startsWith(exclusion))
      const targetPathIsAuth = authPageExclusions.some((exclusion) => path.startsWith(exclusion))

      if (currentPathIsAuth && targetPathIsAuth) {
        // Skip navigation if transitioning between auth pages
        const currentLocationWithoutParams = location.pathname.split("?")[0]
        const targetLocationWithoutParams = path.split("?")[0]

        const isSameAuthPage = authPageExclusions.some((exclusion) => {
          return currentLocationWithoutParams.startsWith(exclusion) && targetLocationWithoutParams.startsWith(exclusion)
        })

        if (isSameAuthPage) {
          return
        }
      }

      navigate(path, { replace, state })
    },
    [navigate, authPageExclusions, location.pathname],
  )

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  const goForward = useCallback(() => {
    navigate(1)
  }, [navigate])

  const value: MatrixNavigationContextProps = {
    navigateTo,
    currentPath,
    params: params as Readonly<Params<string>>,
    searchParams,
    goBack,
    goForward,
  }

  return <MatrixNavigationContext.Provider value={value}>{children}</MatrixNavigationContext.Provider>
}
