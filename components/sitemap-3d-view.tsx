"use client"

import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { motion } from "framer-motion"

// Define the site structure (simplified for 3D visualization)
const siteStructure = [
  { id: "home", title: "Home", path: "/", color: "#000000" },
  { id: "about", title: "About", path: "/about", color: "#1a365d" },
  { id: "revolution", title: "Revolution", path: "/revolution", color: "#2c5282" },
  { id: "features", title: "Features", path: "/features", color: "#2b6cb0" },
  { id: "partners", title: "Partners", path: "/partners", color: "#3182ce" },
  { id: "contact", title: "Contact", path: "/contact", color: "#4299e1" },
  { id: "privacy", title: "Privacy", path: "/privacy", color: "#63b3ed" },
  { id: "disclaimer", title: "Disclaimer", path: "/disclaimer", color: "#90cdf4" },
]

export default function Sitemap3DView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f5)

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 15

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.rotateSpeed = 0.5

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 10, 10)
    scene.add(directionalLight)

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()

    // Node objects and mapping
    const nodes: THREE.Mesh[] = []
    const nodeMap = new Map<THREE.Mesh, { id: string; path: string }>()

    // Create nodes
    siteStructure.forEach((item, index) => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(item.color),
        metalness: 0.3,
        roughness: 0.4,
      })

      const node = new THREE.Mesh(geometry, material)

      // Position in a circle
      const angle = (index / siteStructure.length) * Math.PI * 2
      const radius = 8
      node.position.x = Math.cos(angle) * radius
      node.position.y = Math.sin(angle) * radius
      node.position.z = 0

      scene.add(node)
      nodes.push(node)
      nodeMap.set(node, { id: item.id, path: item.path })
    })

    // Create central node (home)
    const homeGeometry = new THREE.SphereGeometry(1, 32, 32)
    const homeMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      metalness: 0.5,
      roughness: 0.2,
    })

    const homeNode = new THREE.Mesh(homeGeometry, homeMaterial)
    homeNode.position.set(0, 0, 0)
    scene.add(homeNode)
    nodes.push(homeNode)
    nodeMap.set(homeNode, { id: "home", path: "/" })

    // Create connections
    nodes.forEach((node) => {
      if (node !== homeNode) {
        const start = new THREE.Vector3(0, 0, 0)
        const end = node.position.clone()

        const direction = end.clone().sub(start)
        const length = direction.length()

        const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end])
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.5 })
        const line = new THREE.Line(lineGeometry, lineMaterial)

        scene.add(line)
      }
    })

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }

    window.addEventListener("resize", handleResize)

    // Handle mouse move for hover effects
    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(nodes)

      if (intersects.length > 0) {
        const intersectedNode = intersects[0].object as THREE.Mesh
        const nodeInfo = nodeMap.get(intersectedNode)

        if (nodeInfo) {
          setHoveredNode(nodeInfo.id)
          document.body.style.cursor = "pointer"
        }
      } else {
        setHoveredNode(null)
        document.body.style.cursor = "default"
      }
    }

    containerRef.current.addEventListener("mousemove", handleMouseMove)

    // Handle click for navigation
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(nodes)

      if (intersects.length > 0) {
        const intersectedNode = intersects[0].object as THREE.Mesh
        const nodeInfo = nodeMap.get(intersectedNode)

        if (nodeInfo) {
          router.push(nodeInfo.path)
        }
      }
    }

    containerRef.current.addEventListener("click", handleClick)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate nodes slightly
      nodes.forEach((node) => {
        if (node !== homeNode) {
          node.rotation.x += 0.005
          node.rotation.y += 0.005
        }
      })

      // Update hover effects
      nodes.forEach((node) => {
        const nodeInfo = nodeMap.get(node)
        if (nodeInfo && hoveredNode === nodeInfo.id) {
          ;(node.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x666666)
          node.scale.set(1.2, 1.2, 1.2)
        } else {
          ;(node.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000000)
          node.scale.set(1, 1, 1)
        }
      })

      controls.update()
      renderer.render(scene, camera)
    }

    animate()
    setIsLoading(false)

    // Cleanup
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove)
        containerRef.current.removeEventListener("click", handleClick)
        containerRef.current.removeChild(renderer.domElement)
      }

      window.removeEventListener("resize", handleResize)

      // Dispose geometries and materials
      nodes.forEach((node) => {
        node.geometry.dispose()
        ;(node.material as THREE.Material).dispose()
      })
    }
  }, [router, hoveredNode])

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full h-[400px] rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
          </div>
        )}
      </div>

      {hoveredNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg"
        >
          <p className="font-medium">{siteStructure.find((item) => item.id === hoveredNode)?.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Click to navigate</p>
        </motion.div>
      )}

      <div className="absolute bottom-4 right-4 text-xs text-gray-500 dark:text-gray-400">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}
