"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import authData from "@/data/auth.json"
import formData from "@/data/form-data.json"
import uiContent from "@/data/ui-content.json"

const iconMap = {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
}

export default function SignInPage() {
  const [signinFormData, setSigninFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const { admin } = uiContent
  const { signinForm } = formData

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSigninFormData({
      ...signinFormData,
      [e.target.name]: e.target.value,
    })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = authData.users.find(
      (u) => u.username === signinFormData.username && u.password === signinFormData.password,
    )

    if (user) {
      localStorage.setItem("admin-auth", JSON.stringify(user))
      router.push("/admin/dashboard")
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <Lock className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-white mb-2">{admin.signin.title}</h1>
            <p className="text-gray-400">{admin.signin.subtitle}</p>
          </div>

          {/* Demo Credentials */}
          {admin.signin.demoCredentials.show && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6"
            >
              <p className="text-blue-400 text-sm font-medium mb-2">Demo Credentials:</p>
              <p className="text-gray-300 text-sm">
                Username: <span className="font-mono">{admin.signin.demoCredentials.username}</span>
              </p>
              <p className="text-gray-300 text-sm">
                Password: <span className="font-mono">{admin.signin.demoCredentials.password}</span>
              </p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {signinForm.fields.map((field, index) => {
              const Icon = iconMap[field.icon as keyof typeof iconMap]
              return (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                >
                  <label htmlFor={field.id} className="block text-sm font-medium text-gray-300 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id={field.id}
                      name={field.name}
                      type={field.type === "password" && showPassword ? "text" : field.type}
                      required={field.required}
                      value={signinFormData[field.name as keyof typeof signinFormData]}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400"
                      placeholder={field.placeholder}
                    />
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {signinForm.submitButton.loadingText}
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {signinForm.submitButton.text}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Back to Portfolio */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-6"
          >
            <a href="/" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
              {admin.signin.backToPortfolio}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
