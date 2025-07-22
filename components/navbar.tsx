"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "./theme-provider"
import { Button } from "@/components/ui/button"
import navigationData from "@/data/navigation.json"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { theme, setTheme } = useTheme()
  const { scrollY } = useScroll()

  const backgroundColor = useTransform(scrollY, [0, 100], ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.8)"])
  const backdropBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(10px)"])

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigationData.mainNavigation
        .filter((item) => item.type === "anchor")
        .map((item) => item.href.slice(1))

      const currentSection = sections.find((section) => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string, type: string) => {
    if (type === "link") {
      if (href === "/blog") {
        window.location.href = href
      } else {
        window.location.href = href
      }
    } else {
      const element = document.getElementById(href.slice(1))
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    setIsOpen(false)
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      style={{ backgroundColor, backdropFilter: backdropBlur }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
        >
          {"<SP />"}
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navigationData.mainNavigation.map((item, index) => (
            <motion.button
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => scrollToSection(item.href, item.type)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-cyan-400 ${
                activeSection === item.href.slice(1) ? "text-cyan-400" : "text-gray-300"
              }`}
            >
              {item.name}
              {activeSection === item.href.slice(1) && (
                <motion.div
                  layoutId="activeSection"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-300 hover:text-cyan-400"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button> */}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300 hover:text-cyan-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        className="md:hidden overflow-hidden bg-black/90 backdrop-blur-lg rounded-lg mt-4"
      >
        <div className="px-4 py-2 space-y-2">
          {navigationData.mainNavigation.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href, item.type)}
              className={`block w-full text-left px-3 py-2 text-sm font-medium transition-colors hover:text-cyan-400 ${
                activeSection === item.href.slice(1) ? "text-cyan-400" : "text-gray-300"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  )
}
