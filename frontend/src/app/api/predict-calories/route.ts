import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Transform the data to match the backend expected format
    const backendData = {
      Gender: body.gender === 'male' ? 1 : 0, // Assuming 1 for male, 0 for female
      Age: body.age,
      Height: body.height,
      Weight: body.weight,
      Duration: body.duration,
      Heart_Rate: body.heart_rate,
      Body_Temp: body.body_temp
    }

    // Call the backend server
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    })

    if (!response.ok) {
      throw new Error('Failed to get prediction from backend')
    }

    const result = await response.json()
    
    // Parse the prediction (it might come as a string)
    const calories = typeof result.prediction === 'string' 
      ? parseFloat(result.prediction.trim()) 
      : result.prediction

    return NextResponse.json({ calories: Math.round(calories) })
  } catch (error) {
    console.error('Prediction error:', error)
    return NextResponse.json(
      { error: 'Failed to get prediction' },
      { status: 500 }
    )
  }
}
