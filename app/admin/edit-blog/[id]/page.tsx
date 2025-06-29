"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Save, Upload, X, ArrowLeft, ExternalLink } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RichTextEditor } from "@/components/rich-text-editor"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import blogsData from "@/data/blogs.json"
import toastMessages from "@/data/toast-messages.json"
import Image from "next/image"

interface BlogFormData {
  title: string
  tags: string
  content: string
  slug: string
  metaDescription: string
  coverImage: File | null
  published: boolean
}

export default function EditBlogPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [formData, setFormData] = useState<BlogFormData>({
    title: "",
    tags: "",
    content: "",
    slug: "",
    metaDescription: "",
    coverImage: null,
    published: false,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [originalBlog, setOriginalBlog] = useState<any>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth")
    if (!auth) {
      router.push("/admin/signin")
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  useEffect(() => {
    // Load blog data
    const blogId = Number.parseInt(params.id as string)
    const blog = blogsData.blogs.find((b) => b.id === blogId)

    if (blog) {
      setOriginalBlog(blog)
      setFormData({
        title: blog.title,
        tags: blog.tags.join(", "),
        content: blog.content,
        slug: blog.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        metaDescription: blog.excerpt,
        coverImage: null,
        published: blog.published,
      })
      setPreviewImage(blog.image)
    } else {
      toast({
        title: "Error",
        description: toastMessages.error.blogNotFound,
        variant: "destructive",
      })
      router.push("/admin/all-blogs")
    }
  }, [params.id, router, toast])

  useEffect(() => {
    // Check for unsaved changes
    if (originalBlog) {
      const hasChanges =
        formData.title !== originalBlog.title ||
        formData.tags !== originalBlog.tags.join(", ") ||
        formData.content !== originalBlog.content ||
        formData.published !== originalBlog.published
      setHasUnsavedChanges(hasChanges)
    }
  }, [formData, originalBlog])

  const handleLogout = () => {
    if (hasUnsavedChanges) {
      if (!confirm(toastMessages.warning.unsavedChanges)) {
        return
      }
    }
    localStorage.removeItem("admin-auth")
    router.push("/")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Auto-generate slug from title
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setFormData((prev) => ({
        ...prev,
        slug,
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
      }))

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
    }))
    setPreviewImage(originalBlog?.image || null)
  }

  const handleSave = () => {
    console.log("Saving changes:", formData)
    toast({
      title: "Success!",
      description: toastMessages.success.blogUpdated,
      variant: "success",
    })
    setHasUnsavedChanges(false)
  }

  const handlePublish = () => {
    if (!formData.published && !confirm(toastMessages.warning.publishConfirm)) {
      return
    }
    if (formData.published && !confirm(toastMessages.warning.unpublishConfirm)) {
      return
    }

    setFormData((prev) => ({ ...prev, published: !prev.published }))
    console.log("Toggling publish status:", formData)

    toast({
      title: "Success!",
      description: formData.published ? toastMessages.success.blogUnpublished : toastMessages.success.blogPublished,
      variant: "success",
    })
  }

  const handlePreview = () => {
    window.open(`/blog/${params.id}`, "_blank")
  }

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (!confirm(toastMessages.warning.unsavedChanges)) {
        return
      }
    }
    router.push("/admin/all-blogs")
  }

  if (!isAuthenticated || !originalBlog) {
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
          <div className="flex items-center justify-between">
            <div>
              <Button onClick={handleBack} variant="ghost" className="mb-4 text-gray-300 hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Blogs
              </Button>
              <h1 className="text-3xl font-bold text-white mb-2">Edit Blog Post</h1>
              <p className="text-gray-400">Update and manage your blog post content.</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handlePreview}
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-600/10 bg-transparent"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview
              </Button>
              {hasUnsavedChanges && (
                <Badge variant="destructive" className="px-3 py-1">
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Title */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <label className="block text-white font-medium mb-3">Title</label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            {/* Tags */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <label className="block text-white font-medium mb-3">Tags</label>
              <Input
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., react, javascript, webdev"
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
              <p className="text-gray-400 text-sm mt-2">Comma-separated values</p>
            </div>

            {/* Cover Image */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <label className="block text-white font-medium mb-3">Cover Image</label>

              {previewImage ? (
                <div className="relative">
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Cover preview"
                    width={300}
                    height={200}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    onClick={removeImage}
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm mb-2">Upload a file</p>
                  <p className="text-gray-500 text-xs">PNG, JPG, GIF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* SEO Settings */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4">SEO Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Slug</label>
                  <Input
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="Enter URL-friendly slug"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Meta Description</label>
                  <Input
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    placeholder="Enter meta description (max 160 characters)"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Publish Status */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4">Publish Status</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300">
                    Status:{" "}
                    <Badge variant={formData.published ? "default" : "secondary"}>
                      {formData.published ? "Published" : "Draft"}
                    </Badge>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {formData.published ? "This post is live and visible to readers" : "This post is saved as a draft"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Content Editor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Content Editor */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4">Content Editor</h3>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                placeholder="Write your post content here..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                disabled={!hasUnsavedChanges}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                onClick={handlePublish}
                className={
                  formData.published
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                }
              >
                {formData.published ? "Unpublish" : "Publish"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
