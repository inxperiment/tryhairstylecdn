"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Camera } from "lucide-react"

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        onImageUpload(imageData)
        setIsCameraActive(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error("Camera access denied:", err)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const imageData = canvasRef.current.toDataURL("image/jpeg")
        onImageUpload(imageData)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      setIsCameraActive(false)
    }
  }

  return (
    <div className="space-y-4">
      {!isCameraActive ? (
        <div className="space-y-3">
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Photo
          </Button>
          <Button
            onClick={startCamera}
            variant="outline"
            className="w-full py-6 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
          >
            <Camera className="mr-2 h-5 w-5" />
            Take Photo
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </div>
      ) : (
        <div className="space-y-3">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black" />
          <div className="flex gap-3">
            <Button onClick={capturePhoto} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6">
              Capture
            </Button>
            <Button onClick={stopCamera} variant="outline" className="flex-1 py-6 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
