"use client"


import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Activity, Heart, Thermometer, Weight, Ruler, Clock, User } from "lucide-react"
import Image from "next/image"

interface PredictionData {
  gender: string
  age: number
  height: number
  weight: number
  duration: number
  heart_rate: number
  body_temp: number
}

interface AnimatedCounterProps {
  value: number
  duration?: number
}

function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useState(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      setDisplayValue(Math.floor(progress * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  })

  return <span>{displayValue}</span>
}

export default function CaloriesPredictorPage() {
  const [formData, setFormData] = useState<PredictionData>({
    gender: "",
    age: 0,
    height: 0,
    weight: 0,
    duration: 0,
    heart_rate: 0,
    body_temp: 0,
  })

  const [prediction, setPrediction] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof PredictionData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" ? (field === "gender" ? value : Number.parseFloat(value) || 0) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate required fields
    if (!formData.gender || !formData.age || !formData.height || !formData.weight || 
        !formData.duration || !formData.heart_rate || !formData.body_temp) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/predict-calories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get prediction")
      }

      const result = await response.json()
      setPrediction(result.calories)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      console.error("Prediction error:", err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      gender: "",
      age: 0,
      height: 0,
      weight: 0,
      duration: 0,
      heart_rate: 0,
      body_temp: 0,
    })
    setPrediction(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                <Flame className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Calories Burnt Predictor</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Get accurate predictions of calories burned during your workout using Machine Learning
            </p>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg viewBox="0 0 1200 120" fill="none" className="w-full h-16">
            <path d="M0,120 L1200,120 L1200,60 C1200,60 600,0 0,60 Z" fill="rgb(255 247 237)" />
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <Activity className="h-6 w-6 text-orange-500" />
                Enter Your Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-orange-500" />
                      Gender
                    </Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-orange-500" />
                      Age (years)
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age || ""}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Height */}
                  <div className="space-y-2">
                    <Label htmlFor="height" className="flex items-center gap-2 text-sm font-medium">
                      <Ruler className="h-4 w-4 text-orange-500" />
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="170"
                      value={formData.height || ""}
                      onChange={(e) => handleInputChange("height", e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight" className="flex items-center gap-2 text-sm font-medium">
                      <Weight className="h-4 w-4 text-orange-500" />
                      Weight (kg)
                    </Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={formData.weight || ""}
                      onChange={(e) => handleInputChange("weight", e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Duration */}
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-orange-500" />
                      Duration (minutes)
                    </Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="30"
                      value={formData.duration || ""}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Heart Rate */}
                  <div className="space-y-2">
                    <Label htmlFor="heart_rate" className="flex items-center gap-2 text-sm font-medium">
                      <Heart className="h-4 w-4 text-orange-500" />
                      Heart Rate (bpm)
                    </Label>
                    <Input
                      id="heart_rate"
                      type="number"
                      placeholder="120"
                      value={formData.heart_rate || ""}
                      onChange={(e) => handleInputChange("heart_rate", e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Body Temperature */}
                <div className="space-y-2">
                  <Label htmlFor="body_temp" className="flex items-center gap-2 text-sm font-medium">
                    <Thermometer className="h-4 w-4 text-orange-500" />
                    Body Temperature (°C)
                  </Label>
                  <Input
                    id="body_temp"
                    type="number"
                    step="0.1"
                    placeholder="37.0"
                    value={formData.body_temp || ""}
                    onChange={(e) => handleInputChange("body_temp", e.target.value)}
                    className="transition-all focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 transition-all transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Predicting...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Flame className="h-4 w-4" />
                        Predict Calories
                      </div>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="px-6 hover:bg-gray-50 bg-transparent"
                  >
                    Reset
                  </Button>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-8">
            {/* Fitness Image */}
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="relative h-64 bg-gradient-to-br from-orange-400 to-red-500">
                <Image
                  src="https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg"
                  alt="Fitness workout"
                  fill
                  className="object-cover mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Track Your Progress</h3>
                  <p className="text-sm opacity-90">Every calorie counts towards your goals</p>
                </div>
              </div>
            </Card>

            {/* Results Display */}
            {prediction !== null && (
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-orange-500 to-red-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <CardContent className="relative p-8 text-center">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-white/20 rounded-full mb-4">
                      <Flame className="h-12 w-12 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Calories Burned</h2>
                    <p className="text-white/80">Based on your workout data</p>
                  </div>

                  <div className="relative">
                    <div className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">
                      <AnimatedCounter value={prediction} />
                    </div>
                    <div className="text-xl font-semibold text-white/90 mb-6">CALORIES</div>

                    {/* Progress Bar Animation */}
                    <div className="w-full bg-white/20 rounded-full h-3 mb-6 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-2000 ease-out"
                        style={{ width: `${Math.min((prediction / 500) * 100, 100)}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-lg font-bold">{Math.round(prediction / 4.184)}</div>
                        <div className="text-xs text-white/70">kJ</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-lg font-bold">{Math.round(prediction * 0.00013)}</div>
                        <div className="text-xs text-white/70">lbs lost</div>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-lg font-bold">{Math.round(prediction / formData.duration)}</div>
                        <div className="text-xs text-white/70">cal/min</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-500" />
                  Fitness Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    Higher heart rate typically means more calories burned
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    Longer workout duration increases total calorie burn
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    Body weight affects the energy required for exercise
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
