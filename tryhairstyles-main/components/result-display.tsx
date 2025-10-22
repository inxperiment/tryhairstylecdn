"use client"

import { Loader2 } from "lucide-react"

interface ResultDisplayProps {
  image: string | null
  isLoading: boolean
  error: string | null
}

export default function ResultDisplay({ image, isLoading, error }: ResultDisplayProps) {
  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg border-2 border-red-200">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-slate-50 rounded-lg border-2 border-slate-200">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Generating your new hairstyle...</p>
        <p className="text-slate-500 text-sm mt-2">This may take a moment</p>
      </div>
    )
  }

  if (!image) {
    return (
      <div className="flex items-center justify-center h-96 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
        <div className="text-center">
          <p className="text-slate-600 font-medium">Your generated hairstyle will appear here</p>
          <p className="text-slate-500 text-sm mt-2">Upload a photo and describe your desired style to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <img
        src={image || "/placeholder.svg"}
        alt="Generated hairstyle"
        className="w-full h-auto rounded-lg object-cover max-h-96"
      />
      <p className="text-sm text-slate-600 text-center">Your AI-generated hairstyle preview</p>
    </div>
  )
}
