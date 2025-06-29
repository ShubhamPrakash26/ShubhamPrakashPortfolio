"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  const y1 = useTransform(scrollY, [0, 1000], [0, -200])
  const y2 = useTransform(scrollY, [0, 1000], [0, -400])
  const y3 = useTransform(scrollY, [0, 1000], [0, -600])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createFloatingElement = () => {
      const element = document.createElement("div")
      element.className = "absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"
      element.style.left = Math.random() * 100 + "%"
      element.style.top = Math.random() * 100 + "%"
      element.style.animationDelay = Math.random() * 3 + "s"
      element.style.animationDuration = Math.random() * 3 + 2 + "s"

      container.appendChild(element)

      setTimeout(() => {
        if (container.contains(element)) {
          container.removeChild(element)
        }
      }, 5000)
    }

    const interval = setInterval(createFloatingElement, 500)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

      {/* Animated Geometric Shapes */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-32 h-32 border border-cyan-400/20 rotate-45 rounded-lg"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-40 right-20 w-24 h-24 border border-purple-400/20 rotate-12 rounded-full"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute bottom-40 left-1/4 w-40 h-40 border border-blue-400/10 -rotate-12 rounded-xl"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/5 to-transparent animate-pulse" />
      </div>
    </div>
  )
}
