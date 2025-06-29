"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, Mail, Heart, Code, Coffee } from "lucide-react"
import personalData from "@/data/personal.json"
import navigationData from "@/data/navigation.json"
import uiContent from "@/data/ui-content.json"

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { socialLinks, footerLinks } = navigationData
  const { footer } = uiContent

  // Create a mapping for social icons
  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case "Github":
        return Github
      case "Linkedin":
        return Linkedin
      case "Mail":
        return Mail
      default:
        return Mail // fallback
    }
  }

  return (
    <footer className="relative bg-gray-900/50 backdrop-blur-sm border-t border-gray-800">
      {/* Matrix Background Effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-400 font-mono text-xs"
            animate={{
              y: [0, 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
            style={{
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          >
            {Math.random().toString(36).substring(7)}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {"<SP />"}
            </div>
            <p className="text-gray-400 leading-relaxed">{footer.brandDescription}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{footer.madeWith}</span>
              <Heart className="h-4 w-4 text-red-400 animate-pulse" />
              <span>{footer.and}</span>
              <Coffee className="h-4 w-4 text-yellow-400" />
              <span>{footer.by}</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">{footer.quickLinksTitle}</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Code className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-white">{footer.connectTitle}</h3>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">{personalData.email}</p>
              <p className="text-gray-400 text-sm">{personalData.phone}</p>
              <p className="text-gray-400 text-sm">{personalData.location}</p>
            </div>

            <div className="flex space-x-4 pt-2">
              {socialLinks.map((link) => {
                const IconComponent = getSocialIcon(link.icon)
                return (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 group"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent className="h-5 w-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-gray-400 text-sm">
            © {currentYear} {personalData.name}. {footer.copyright}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{footer.builtWith}</span>
            <span>•</span>
            <span>{footer.deployedOn}</span>
          </div>
        </motion.div>

        {/* Easter Egg */}
        <div className="hidden">{console.log(footer.easterEgg)}</div>
      </div>
    </footer>
  )
}
