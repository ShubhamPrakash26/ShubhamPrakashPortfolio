"use client"

import { motion } from "framer-motion"
import { Calendar, Eye, ArrowLeft, Tag, Share2, Heart, MessageCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import blogsData from "@/data/blogs.json"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  tags: string[]
  image: string
  views: number
  published: boolean
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    const blogId = Number.parseInt(params.id as string)
    const foundBlog = blogsData.blogs.find((b) => b.id === blogId && b.published)

    if (foundBlog) {
      setBlog(foundBlog)
      setLikes(Math.floor(Math.random() * 50) + 10) // Simulate likes

      // Find related posts
      const related = blogsData.blogs
        .filter((b) => b.id !== blogId && b.published && b.tags.some((tag) => foundBlog.tags.includes(tag)))
        .slice(0, 3)
      setRelatedPosts(related)
    }
  }, [params.id])

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
    toast({
      title: isLiked ? "Removed from favorites" : "Added to favorites",
      description: isLiked ? "Post removed from your favorites" : "Post added to your favorites",
      variant: "success",
    })
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      })
    } catch (error) {
      // Fallback to copying URL
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Blog post link copied to clipboard",
        variant: "success",
      })
    }
  }

  const renderContent = (content: string) => {
  let html = content
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-3 text-white">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4 text-white">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-6 text-white">$1</h1>')
    .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-800 text-cyan-400 text-sm font-mono p-4 rounded overflow-x-auto mb-4"><code>$1</code></pre>')
    .replace(/`([^`]+)`/gim, '<code class="bg-gray-800 px-2 py-1 rounded text-cyan-400 font-mono">$1</code>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong class="text-white">$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em class="text-gray-300">$1</em>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-6" />')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-cyan-400 pl-4 italic text-gray-300 my-4">$1</blockquote>')
    .replace(/^- (.*$)/gim, '<ul class="list-disc list-inside text-gray-300 mb-4"><li>$1</li></ul>')
    .replace(/^\d+\. (.*$)/gim, '<ol class="list-decimal list-inside text-gray-300 mb-4"><li>$1</li></ol>')
    .replace(/\n{2,}/gim, '</p><p class="text-gray-300 leading-relaxed mb-4">')
    .replace(/\n/gim, "<br>")

  html = '<p class="text-gray-300 leading-relaxed mb-4">' + html + '</p>'
  return <div className="prose prose-invert max-w-none">{/* @ts-ignore */}<div dangerouslySetInnerHTML={{ __html: html }} /></div>
}


  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading blog post...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
        <div className="relative h-96 overflow-hidden">
          <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
        </div>

        <div className="absolute inset-0 z-20 flex items-end">
          <div className="max-w-4xl mx-auto px-4 pb-12 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Link href="/blog">
                <Button variant="ghost" className="mb-6 text-gray-300 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-400/50">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{blog.title}</h1>

              <div className="flex items-center gap-6 text-gray-300">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(blog.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{blog.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{Math.ceil(blog.content.length / 1000)} min read</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8">
              {renderContent(blog.content)}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Actions */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <Button
                  onClick={handleLike}
                  variant="outline"
                  className={`w-full justify-start ${
                    isLiked ? "border-red-500 text-red-400" : "border-gray-600 text-gray-300"
                  }`}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
                  {likes} Likes
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comments
                </Button>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Related Posts</h3>
                <div className="space-y-4">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative h-20 mb-2 rounded-lg overflow-hidden">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="text-white text-sm font-medium group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-gray-400 text-xs mt-1">{new Date(post.date).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
