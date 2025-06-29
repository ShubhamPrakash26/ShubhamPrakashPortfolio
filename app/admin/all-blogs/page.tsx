"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Search, Edit, Trash2, Eye, Calendar, ExternalLink } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import blogsData from "@/data/blogs.json"
import uiContent from "@/data/ui-content.json"
import { useToast } from "@/hooks/use-toast"
import toastMessages from "@/data/toast-messages.json"

export default function AllBlogsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBlogs, setFilteredBlogs] = useState(blogsData.blogs)
  const router = useRouter()
  const { toast } = useToast()

  const { admin } = uiContent

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth")
    if (!auth) {
      router.push("/admin/signin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    const filtered = blogsData.blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredBlogs(filtered)
  }, [searchTerm])

  const handleLogout = () => {
    localStorage.removeItem("admin-auth")
    router.push("/")
  }

  const handleEdit = (blogId: number) => {
    router.push(`/admin/edit-blog/${blogId}`)
  }

  const handleDelete = (blogId: number) => {
    if (confirm(toastMessages.warning.deleteConfirm)) {
      console.log("Deleting blog:", blogId)
      toast({
        title: "Success!",
        description: toastMessages.success.blogDeleted,
        variant: "success",
      })
    }
  }

  const handleView = (blogId: number) => {
    window.open(`/blog/${blogId}`, "_blank")
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
          <h1 className="text-3xl font-bold text-white mb-2">{admin.allBlogs.title}</h1>
          <p className="text-gray-400">{admin.allBlogs.subtitle}</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder={admin.allBlogs.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => router.push("/admin/create-blog")}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
              >
                {admin.allBlogs.createNewButton}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Blog Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50 border-b border-gray-600">
                <tr>
                  {Object.values(admin.allBlogs.tableHeaders).map((header, index) => (
                    <th key={index} className="text-left p-4 text-gray-300 font-medium">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog, index) => (
                  <motion.tr
                    key={blog.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="p-4">
                      <div>
                        <h3 className="text-white font-medium line-clamp-2">{blog.title}</h3>
                        <p className="text-gray-400 text-sm mt-1 line-clamp-1">{blog.excerpt}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Calendar className="h-4 w-4" />
                        {new Date(blog.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Eye className="h-4 w-4" />
                        {blog.views.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {blog.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={blog.published ? "default" : "secondary"}
                        className={blog.published ? "bg-green-500/20 text-green-400 border-green-400/50" : ""}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleView(blog.id)}
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
                          title="View Post"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(blog.id)}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                          title="Edit Post"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(blog.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600/10"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">{admin.allBlogs.noResults}</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mt-8"
        >
          <div className="flex gap-2">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              {admin.allBlogs.pagination.previous}
            </Button>
            <Button className="bg-cyan-600 hover:bg-cyan-700">1</Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              2
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              3
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              {admin.allBlogs.pagination.next}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
