"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import contactInfo from "@/data/contact-info.json"
import formData from "@/data/form-data.json"
import uiContent from "@/data/ui-content.json"

export function ContactSection() {
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

  const { sections } = uiContent
  const { contactForm } = formData

  // Create icon mapping function
  const getContactIcon = (iconName: string) => {
    switch (iconName) {
      case "Mail":
        return Mail
      case "Phone":
        return Phone
      case "MapPin":
        return MapPin
      default:
        return Mail
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactFormData({
      ...contactFormData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", contactFormData)
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates({ ...copiedStates, [type]: true })
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [type]: false })
      }, 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {sections.contact.title}
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{sections.contact.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Let's Connect</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                I'm always interested in hearing about new opportunities, whether that's a full-time role, freelance
                project, or just a chat about technology.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.contactMethods.map((contact, index) => {
                const IconComponent = getContactIcon(contact.icon)
                const copied = copiedStates[contact.type]

                return (
                  <motion.div
                    key={contact.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group flex items-center gap-4 p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-cyan-400/50 transition-all duration-300"
                  >
                    <div className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">{contact.label}</p>
                      <a href={contact.href} className="text-white font-medium hover:text-cyan-400 transition-colors">
                        {contact.value}
                      </a>
                    </div>
                    {contact.copyable && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(contact.value, contact.type)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    )}
                  </motion.div>
                )
              })}
            </div>

            {/* Availability Status */}
            {sections.contact.availabilityStatus.available && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-semibold">{sections.contact.availabilityStatus.text}</span>
                </div>
                <p className="text-gray-300 text-sm">{sections.contact.availabilityStatus.description}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300">
                <h3 className="text-xl font-bold text-white mb-6">{sections.contact.formTitle}</h3>

                <div className="space-y-4">
                  {contactForm.fields.map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.id}
                          name={field.name}
                          required={field.required}
                          rows={field.rows}
                          value={contactFormData[field.name as keyof typeof contactFormData]}
                          onChange={handleInputChange}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400 resize-none"
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <Input
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          required={field.required}
                          value={contactFormData[field.name as keyof typeof contactFormData]}
                          onChange={handleInputChange}
                          className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {contactForm.submitButton.text}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
