"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ImageUpload from "@/components/image-upload"
import HairstyleForm from "@/components/hairstyle-form"
import ResultDisplay from "@/components/result-display"
import { X, Download } from "lucide-react"

interface GeneratedHairstyle {
  id: string
  description: string
  imageUrl: string
  timestamp: number
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<GeneratedHairstyle[]>([])
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)

  const handleImageUpload = (imageData: string) => {
    setUploadedImage(imageData)
    setGeneratedImage(null)
    setError(null)
    setHistory([])
    setSelectedHistoryId(null)
  }

  const handleGenerateHairstyle = async (hairDescription: string) => {
    if (!uploadedImage) {
      setError("Please upload an image first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-hairstyle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faceImage: uploadedImage,
          hairDescription,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate hairstyle")
      }

      const data = await response.json()
      const newHairstyle: GeneratedHairstyle = {
        id: Date.now().toString(),
        description: hairDescription,
        imageUrl: data.imageUrl,
        timestamp: Date.now(),
      }

      setGeneratedImage(data.imageUrl)
      setHistory((prev) => [newHairstyle, ...prev])
      setSelectedHistoryId(newHairstyle.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectFromHistory = (id: string) => {
    const selected = history.find((h) => h.id === id)
    if (selected) {
      setGeneratedImage(selected.imageUrl)
      setSelectedHistoryId(id)
    }
  }

  const handleRemoveFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id))
    if (selectedHistoryId === id) {
      setGeneratedImage(null)
      setSelectedHistoryId(null)
    }
  }

  const handleDownloadImage = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `hairstyle-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Failed to download image:", err)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-3">Try On Hairstyles</h1>
          <p className="text-xl text-slate-600">
            Upload your photo and describe your dream haircut. See how it looks instantly with AI.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload & Form */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-8 border-0 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Step 1: Upload Your Photo</h2>
              <ImageUpload onImageUpload={handleImageUpload} />
              {uploadedImage && (
                <div className="mt-6">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Uploaded face"
                    className="w-full h-auto rounded-lg object-cover max-h-96"
                  />
                </div>
              )}
            </Card>

            <Card className="p-8 border-0 shadow-lg">
              <h2 className="text-2xl font-semibold text-slate-900 mb-6">Step 2: Describe Your Hairstyle</h2>
              <HairstyleForm onSubmit={handleGenerateHairstyle} isLoading={isLoading} disabled={!uploadedImage} />
            </Card>
          </div>

          {/* Right Column - Results & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Result */}
            <Card className="p-8 border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-slate-900">Your New Look</h2>
                {generatedImage && (
                  <Button onClick={handleDownloadImage} variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
              <ResultDisplay image={generatedImage} isLoading={isLoading} error={error} />
            </Card>

            {/* History of Generated Hairstyles */}
            {history.length > 0 && (
              <Card className="p-8 border-0 shadow-lg">
                <h3 className="text-xl font-semibold text-slate-900 mb-4">Try-On History</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((hairstyle) => (
                    <div
                      key={hairstyle.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedHistoryId === hairstyle.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50"
                      }`}
                      onClick={() => handleSelectFromHistory(hairstyle.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{hairstyle.description}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {new Date(hairstyle.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFromHistory(hairstyle.id)
                          }}
                          className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                          aria-label="Remove from history"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
