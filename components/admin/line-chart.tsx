"use client"

import { motion } from "framer-motion"

interface DataPoint {
  month: string
  views: number
}

interface LineChartProps {
  data: DataPoint[]
}

export function LineChart({ data }: LineChartProps) {
  const maxViews = Math.max(...data.map((d) => d.views))
  const minViews = Math.min(...data.map((d) => d.views))
  const range = maxViews - minViews

  const getY = (views: number) => {
    return 100 - ((views - minViews) / range) * 80 + 10
  }

  const pathData = data
    .map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = getY(point.views)
      return `${index === 0 ? "M" : "L"} ${x} ${y}`
    })
    .join(" ")

  return (
    <div className="relative h-64 w-full">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(75, 85, 99, 0.3)" strokeWidth="0.2" />
        ))}

        {/* Area under curve */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d={`${pathData} L 100 100 L 0 100 Z`}
          fill="url(#gradient)"
        />

        {/* Line */}
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d={pathData}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="0.8"
          strokeLinecap="round"
        />

        {/* Data points */}
        {data.map((point, index) => (
          <motion.circle
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 + 1, duration: 0.3 }}
            cx={(index / (data.length - 1)) * 100}
            cy={getY(point.views)}
            r="1"
            fill="#3B82F6"
            className="drop-shadow-lg"
          />
        ))}

        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* X-axis labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-400 mt-2">
        {data.map((point, index) => (
          <span key={index}>{point.month}</span>
        ))}
      </div>
    </div>
  )
}
