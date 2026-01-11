"use client"

import { useRef, useMemo } from "react"
import { TetrahedronGeometry, EdgesGeometry, LineBasicMaterial } from "three"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP)

export default function Merkabah() {
  const pyramidRef = useRef(null)

  const radius = 1

  // Create base geometry
  const baseGeometry = useMemo(() => {
    return new TetrahedronGeometry(radius, 0)
  }, [])

  // Create edges geometry
  const edgesGeo = useMemo(() => {
    return new EdgesGeometry(baseGeometry)
  }, [baseGeometry])

  // Create materials
  const mat1 = useMemo(() => {
    return new LineBasicMaterial({
      color: 0xFFBF00, // gold
      linewidth: 2
    })
  }, [])

  const mat2 = useMemo(() => {
    return new LineBasicMaterial({
      color: 0xFFBF00, // goldenrod (slightly warmer gold)
      linewidth: 2
    })
  }, [])

  // Set initial rotation and GSAP animations
  useGSAP(() => {
    if (!pyramidRef.current) return

    // Smooth continuous horizontal rotation (left to right)
    gsap.to(pyramidRef.current.rotation, {
      y: "+=" + Math.PI * 2,
      duration: 60,
      ease: "none",
      repeat: -1
    })
  }, { scope: pyramidRef })

  return (
    <group ref={pyramidRef}>
      {/* First tetrahedron */}
      <lineSegments 
        geometry={edgesGeo} 
        material={mat1}
        rotation={[-Math.atan(Math.sqrt(2)), Math.PI / 4, 0]}
      />
      
      {/* Second tetrahedron (interlocked with first) */}
      <lineSegments 
        geometry={edgesGeo} 
        material={mat2}
        rotation={[-Math.atan(Math.sqrt(2)) + Math.PI, Math.PI / 4, 0]}
      />
    </group>
  )
}
