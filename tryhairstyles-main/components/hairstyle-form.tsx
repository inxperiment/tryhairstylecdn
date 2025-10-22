"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap } from "lucide-react"

interface HairstyleFormProps {
  onSubmit: (description: string) => void
  isLoading: boolean
  disabled: boolean
}

export default function HairstyleForm({ onSubmit, isLoading, disabled }: HairstyleFormProps) {
  const [description, setDescription] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description.trim()) {
      onSubmit(description)
    }
  }

  const suggestionsByCategory = {
    "Short Styles": ["Short pixie cut with layers", "Sleek bob with bangs", "Undercut with fade", "Textured crop"],
    "Medium Styles": [
      "Long wavy hair with highlights",
      "Shoulder-length layers",
      "Shag cut with texture",
      "Lob with side part",
    ],
    "Long Styles": ["Long straight hair", "Curly afro with volume", "Braided styles", "Flowing waves"],
    Trendy: ["Curtain bangs", "Wolf cut", "Mullet", "Butterfly layers"],
  }

  const allSuggestions = Object.values(suggestionsByCategory).flat()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Description Input */}
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-semibold text-slate-700">
          Describe Your Ideal Hairstyle
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Be specific! Include length, texture, color, bangs, layers, etc. (e.g., 'Short blonde bob with side bangs and layers')"
          className="w-full p-4 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none h-32 font-sans transition-all"
          disabled={disabled || isLoading}
        />
        <p className="text-xs text-slate-500">Tip: More detailed descriptions lead to better results!</p>
      </div>

      {/* Category Tabs */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-700">Quick Suggestions:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.keys(suggestionsByCategory).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
              disabled={disabled || isLoading}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-2 gap-2">
          {(selectedCategory
            ? suggestionsByCategory[selectedCategory as keyof typeof suggestionsByCategory]
            : allSuggestions.slice(0, 8)
          ).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setDescription(suggestion)}
              className="text-left text-sm p-3 rounded-lg border-2 border-slate-200 hover:bg-blue-50 hover:border-blue-400 transition-all active:scale-95"
              disabled={disabled || isLoading}
            >
              <div className="flex items-start gap-2">
                <Zap className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={disabled || isLoading || !description.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Sparkles className="mr-2 h-5 w-5" />
        {isLoading ? "Generating..." : "Generate Hairstyle"}
      </Button>
    </form>
  )
}
