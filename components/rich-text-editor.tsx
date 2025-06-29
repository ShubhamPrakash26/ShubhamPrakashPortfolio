"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  Bold,
  Italic,
  Underline,
  Code,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Eye,
  Upload,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import NextImage from "next/image"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showLinkDialog, setShowLinkDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const insertText = (before: string, after = "", placeholder = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder

    const newValue = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    onChange(newValue)

    // Set cursor position
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length + after.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
      textarea.focus()
    }, 0)
  }

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newValue = value.substring(0, start) + text + value.substring(start)
    onChange(newValue)

    setTimeout(() => {
      textarea.setSelectionRange(start + text.length, start + text.length)
      textarea.focus()
    }, 0)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string
          setUploadedImages((prev) => [...prev, imageUrl])
          toast({
            title: "Image uploaded",
            description: "Image has been uploaded successfully!",
            variant: "success",
          })
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const insertLink = () => {
    if (linkUrl && linkText) {
      insertAtCursor(`[${linkText}](${linkUrl})`)
      setLinkUrl("")
      setLinkText("")
      setShowLinkDialog(false)
    }
  }

  const insertImage = () => {
    if (imageUrl && imageAlt) {
      insertAtCursor(`![${imageAlt}](${imageUrl})`)
      setImageUrl("")
      setImageAlt("")
      setShowImageDialog(false)
    }
  }

  const insertUploadedImage = (url: string) => {
    insertAtCursor(`![Uploaded Image](${url})`)
    toast({
      title: "Image inserted",
      description: "Image has been inserted into the editor!",
      variant: "success",
    })
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertText("**", "**", "bold text"), tooltip: "Bold" },
    { icon: Italic, action: () => insertText("*", "*", "italic text"), tooltip: "Italic" },
    { icon: Underline, action: () => insertText("<u>", "</u>", "underlined text"), tooltip: "Underline" },
    { icon: Code, action: () => insertText("`", "`", "code"), tooltip: "Inline Code" },
    { icon: Heading1, action: () => insertText("# ", "", "Heading 1"), tooltip: "Heading 1" },
    { icon: Heading2, action: () => insertText("## ", "", "Heading 2"), tooltip: "Heading 2" },
    { icon: Heading3, action: () => insertText("### ", "", "Heading 3"), tooltip: "Heading 3" },
    { icon: List, action: () => insertText("- ", "", "List item"), tooltip: "Bullet List" },
    { icon: ListOrdered, action: () => insertText("1. ", "", "List item"), tooltip: "Numbered List" },
    { icon: Quote, action: () => insertText("> ", "", "Quote"), tooltip: "Quote" },
    { icon: LinkIcon, action: () => setShowLinkDialog(true), tooltip: "Insert Link" },
    { icon: ImageIcon, action: () => setShowImageDialog(true), tooltip: "Insert Image" },
  ]

  const renderPreview = () => {
    // Simple markdown to HTML conversion for preview
    const html = value
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
      .replace(/\*(.*)\*/gim, "<em>$1</em>")
      .replace(/`(.*)`/gim, '<code class="bg-gray-800 px-2 py-1 rounded text-cyan-400">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-cyan-400 pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\[([^\]]+)\]$$([^)]+)$$/gim, '<a href="$2" class="text-cyan-400 hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]$$([^)]+)$$/gim, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />')
      .replace(/\n/gim, "<br>")

    return <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
        {toolbarButtons.map((button, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            onClick={button.action}
            className="h-8 w-8 p-0 hover:bg-gray-700"
            title={button.tooltip}
          >
            <button.icon className="h-4 w-4" />
          </Button>
        ))}

        <div className="w-px h-6 bg-gray-600 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 px-3 hover:bg-gray-700"
          title="Upload Images"
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="h-8 px-3 hover:bg-gray-700"
          title="Toggle Preview"
        >
          <Eye className="h-4 w-4 mr-1" />
          {isPreviewMode ? "Edit" : "Preview"}
        </Button>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Uploaded Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {uploadedImages.map((url, index) => (
              <div key={index} className="relative group">
                <NextImage
                  src={url || "/placeholder.svg"}
                  alt={`Uploaded ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => insertUploadedImage(url)}
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeUploadedImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Click on an image to insert it into your content</p>
        </div>
      )}

      {/* Editor/Preview */}
      <div className="min-h-[400px] border border-gray-700 rounded-lg overflow-hidden">
        {isPreviewMode ? (
          <div className="p-4 bg-gray-900/50 min-h-[400px]">{renderPreview()}</div>
        ) : (
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] bg-gray-900/50 border-0 text-white placeholder-gray-400 resize-none focus:ring-0 font-mono"
          />
        )}
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Insert Link</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Link Text</label>
                <Input
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Enter link text"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">URL</label>
                <Input
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={insertLink} className="flex-1">
                  Insert Link
                </Button>
                <Button variant="outline" onClick={() => setShowLinkDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Insert Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Alt Text</label>
                <Input
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Describe the image"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Image URL</label>
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={insertImage} className="flex-1">
                  Insert Image
                </Button>
                <Button variant="outline" onClick={() => setShowImageDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
