"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, MessageCircle, Share2 } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { StatsCard } from "@/components/admin/stats-card"
import { ChartCard } from "@/components/admin/chart-card"
import { LineChart } from "@/components/admin/line-chart"
import { ProgressBar } from "@/components/admin/progress-bar"
import { useRouter } from "next/navigation"
import dashboardData from "@/data/dashboard-stats.json"
import analyticsData from "@/data/analytics-data.json"
import uiContent from "@/data/ui-content.json"

export default function AnalyticsPage() {
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
          <h1 className="text-3xl font-bold text-white mb-2">{admin.analytics.title}</h1>
          <p className="text-gray-400">{admin.analytics.subtitle}</p>
        </motion.div>

        {/* Extended Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Views"
            value={dashboardData.stats.totalViews.toLocaleString()}
            icon={TrendingUp}
            trend="+12%"
            trendColor="text-green-400"
          />
          <StatsCard
            title="Unique Visitors"
            value={analyticsData.extendedStats.uniqueVisitors.toLocaleString()}
            icon={Users}
            trend="+8%"
            trendColor="text-green-400"
          />
          <StatsCard
            title="Comments"
            value={analyticsData.extendedStats.totalComments}
            icon={MessageCircle}
            trend="+15%"
            trendColor="text-green-400"
          />
          <StatsCard
            title="Shares"
            value={analyticsData.extendedStats.totalShares.toLocaleString()}
            icon={Share2}
            trend="+22%"
            trendColor="text-green-400"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartCard
            title={admin.analytics.charts.trafficOverTime}
            subtitle={admin.analytics.chartSubtitles.lastSixMonths}
            trend="+18%"
            trendColor="text-green-400"
          >
            <LineChart data={analyticsData.trafficOverTime} />
          </ChartCard>

          <ChartCard
            title={admin.analytics.charts.topPerformingPosts}
            subtitle={admin.analytics.chartSubtitles.byViews}
          >
            <div className="space-y-4">
              {analyticsData.topPerformingPosts.map((post, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-white text-sm font-medium line-clamp-1">{post.title}</h4>
                    <p className="text-gray-400 text-xs">{post.views.toLocaleString()} views</p>
                  </div>
                  <div className="w-16 bg-gray-600 rounded-full h-2 ml-4">
                    <div
                      className="bg-cyan-400 h-2 rounded-full"
                      style={{ width: `${(post.views / analyticsData.topPerformingPosts[0].views) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ChartCard
            title={admin.analytics.charts.trafficSources}
            subtitle={admin.analytics.chartSubtitles.whereVisitorsComeFrom}
          >
            <div className="space-y-4">
              {analyticsData.trafficSources.map((source) => (
                <ProgressBar
                  key={source.source}
                  label={source.source}
                  percentage={source.percentage}
                  color={source.color}
                />
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title={admin.analytics.charts.deviceTypes}
            subtitle={admin.analytics.chartSubtitles.visitorDeviceBreakdown}
          >
            <div className="space-y-4">
              {analyticsData.deviceTypes.map((device) => (
                <ProgressBar
                  key={device.device}
                  label={device.device}
                  percentage={device.percentage}
                  color={device.color}
                />
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title={admin.analytics.charts.geographicDistribution}
            subtitle={admin.analytics.chartSubtitles.topCountries}
          >
            <div className="space-y-4">
              {analyticsData.geographicDistribution.map((country) => (
                <ProgressBar
                  key={country.country}
                  label={country.country}
                  percentage={country.percentage}
                  color={country.color}
                />
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
