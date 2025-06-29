"use client"

import type React from "react"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

interface ChartCardProps {
  title: string
  subtitle?: string
  trend?: string
  trendColor?: string
  children: React.ReactNode
}

export function ChartCard({ title, subtitle, trend, trendColor = "text-green-400", children }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trendColor}`}>
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>

      {children}
    </motion.div>
  )
}
