"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  trendColor?: string
}

export function StatsCard({ title, value, icon: Icon, trend, trendColor = "text-green-400" }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <Icon className="h-5 w-5 text-cyan-400" />
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {trend && <p className={`text-sm ${trendColor}`}>{trend}</p>}
        </div>
      </div>
    </motion.div>
  )
}
