"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface GlitchTextProps {
  text: string
  className?: string
}

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [glitchText, setGlitchText] = useState(text)

  useEffect(() => {
    const glitchChars = "!<>-_\\/[]{}—=+*^?#________"
    let timeoutId: NodeJS.Timeout

    const glitch = () => {
      const glitched = text
        .split("")
        .map((char, index) => {
          if (Math.random() < 0.1) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)]
          }
          return char
        })
        .join("")

      setGlitchText(glitched)

      timeoutId = setTimeout(() => {
        setGlitchText(text)
      }, 50)
    }

    const interval = setInterval(glitch, 3000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
    }
  }, [text])

  return (
    <motion.span
      className={`relative ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {glitchText}
      <motion.span
        className="absolute inset-0 text-cyan-400 opacity-70"
        animate={{
          x: [0, -2, 2, 0],
          opacity: [0, 0.7, 0, 0.7, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 3,
        }}
      >
        {text}
      </motion.span>
    </motion.span>
  )
}
