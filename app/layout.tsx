import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Shubham Prakash - Full-Stack Developer & Data Science Enthusiast",
  description:
    "Portfolio of Shubham Prakash - Building powerful web apps and intelligent solutions by blending full-stack development with data science.",
  keywords: [
    "Shubham Prakash",
    "Full Stack Developer",
    "Data Science",
    "React",
    "Node.js",
    "Python",
    "Machine Learning",
  ],
  authors: [{ name: "Shubham Prakash" }],
  creator: "Shubham Prakash",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shubhamprakash.dev",
    title: "Shubham Prakash - Full-Stack Developer & Data Science Enthusiast",
    description:
      "Building powerful web apps and intelligent solutions by blending full-stack development with data science.",
    siteName: "Shubham Prakash Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shubham Prakash - Full-Stack Developer & Data Science Enthusiast",
    description:
      "Building powerful web apps and intelligent solutions by blending full-stack development with data science.",
    creator: "@shubhamprakash26",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
