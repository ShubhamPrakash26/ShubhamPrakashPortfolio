"use client"

import { motion } from "framer-motion"
import { Download, ExternalLink, Github, Linkedin, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlitchText } from "./glitch-text"
import personalData from "@/data/personal.json"
import navigationData from "@/data/navigation.json"
import uiContent from "@/data/ui-content.json"

export function HeroSection() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  const { hero } = uiContent
  const { socialLinks } = navigationData

  // Create icon mapping functions
  const getCtaIcon = (iconName: string) => {
    switch (iconName) {
      case "ExternalLink":
        return ExternalLink
      case "Download":
        return Download
      default:
        return ExternalLink
    }
  }

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return Github
      case "Linkedin":
        return Linkedin
      case "Mail":
        return Mail
      case "Phone":
        return Phone
      default:
        return Mail
    }
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            animate={{
              x: [0, Math.random() * 1000],
              y: [0, Math.random() * 1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Greeting */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-cyan-400 text-lg font-mono"
          >
            {hero.greeting}
          </motion.p>

          {/* Name with Glitch Effect */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            <GlitchText
              text={personalData.name}
              className="bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent"
            />
          </motion.h1>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 font-mono"
          >
            <span className="text-green-400">{hero.codeSnippets.role.const}</span>{" "}
            <span className="text-blue-400">{hero.codeSnippets.role.variable}</span>{" "}
            <span className="text-white">{hero.codeSnippets.role.equals}</span>{" "}
            <span className="text-yellow-400">"{personalData.role}"</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            {personalData.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          >
            {hero.ctaButtons.map((button, index) => {
              const IconComponent = getCtaIcon(button.icon)
              return (
                <Button
                  key={index}
                  onClick={button.action === "scrollToProjects" ? scrollToProjects : undefined}
                  className={
                    button.type === "primary"
                      ? "group bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                      : "group border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent"
                  }
                  variant={button.type === "primary" ? "default" : "outline"}
                >
                  <IconComponent
                    className={`mr-2 h-5 w-5 ${button.type === "primary" ? "group-hover:rotate-12" : "group-hover:animate-bounce"} transition-transform`}
                  />
                  {button.text}
                </Button>
              )
            })}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex justify-center space-x-6 mt-8"
          >
            {socialLinks.map((link) => {
              const IconComponent = getSocialIcon(link.icon)
              return (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-800/50 border border-gray-700 hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 group"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="h-6 w-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </motion.a>
              )
            })}
          </motion.div>

          {/* Scroll Indicator */}
          {hero.scrollIndicator.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: hero.scrollIndicator.delay }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
                />
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
