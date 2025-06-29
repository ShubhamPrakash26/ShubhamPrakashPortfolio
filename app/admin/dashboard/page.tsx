"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { FileText, Eye, Clock } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { StatsCard } from "@/components/admin/stats-card"
import { ChartCard } from "@/components/admin/chart-card"
import { LineChart } from "@/components/admin/line-chart"
import { ProgressBar } from "@/components/admin/progress-bar"
import { useRouter } from "next/navigation"
import dashboardData from "@/data/dashboard-stats.json"
import uiContent from "@/data/ui-content.json"

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  const { admin } = uiContent

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth")
    if (!auth) {
      router.push("/admin/signin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin-auth")
    router.push("/")
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <AdminSidebar onLogout={handleLogout} />

      <div className="md:ml-64 p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{admin.dashboard.title}</h1>
          <p className="text-gray-400">{admin.dashboard.subtitle}</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Posts"
            value={dashboardData.stats.totalPosts}
            icon={FileText}
            trend="+12%"
            trendColor="text-green-400"
          />
          <StatsCard
            title="Total Views"
            value={dashboardData.stats.totalViews.toLocaleString()}
            icon={Eye}
            trend="+8%"
            trendColor="text-green-400"
          />
          <StatsCard
            title="Avg. Read Time"
            value={`${dashboardData.stats.avgReadTime} min`}
            icon={Clock}
            trend="+5%"
            trendColor="text-green-400"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard title="Blog Views Over Time" subtitle="Last 30 Days" trend="+12%" trendColor="text-green-400">
            <LineChart data={dashboardData.viewsOverTime} />
          </ChartCard>

          <ChartCard title="Engagement by Tags" subtitle="Last 30 Days" trend="+8%" trendColor="text-green-400">
            <div className="space-y-4">
              {dashboardData.engagementByTags.map((tag) => (
                <ProgressBar key={tag.tag} label={tag.tag} percentage={tag.percentage} color={tag.color} />
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <ChartCard title="Recent Activity" subtitle="Latest updates">
            <div className="space-y-4">
              {dashboardData.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg border border-gray-600/30"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{activity.title}</h4>
                    <p className="text-gray-400 text-sm">{activity.description}</p>
                    <p className="text-gray-500 text-xs mt-1">{new Date(activity.timestamp).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </motion.div>
      </div>
    </div>
  )
}
