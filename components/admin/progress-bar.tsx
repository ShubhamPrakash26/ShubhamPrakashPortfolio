"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  label: string
  percentage: number
  color: string
}

export function ProgressBar({ label, percentage, color }: ProgressBarProps) {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className="text-gray-400 text-sm">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  )
}
