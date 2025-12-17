export interface User {
  uid: string
  email?: string
  displayName?: string
  createdAt: Date
}

export interface EvaluationResult {
  targetChar: string
  totalScore: number
  scores: {
    centerOfGravity: number
    strokeNeatness: number
    outerContour: number
    mainStrokeProminence: number
    overallStrokeScore: number
  }
  commentary: {
    overall: string
    structure: Record<string, string>
    strokeDetails: Array<{
      critiqueId: string
      text: string
    }>
  }
  imageUrl?: string
  timestamp: Date
}

export interface Character {
  char: string
  strokes: Stroke[]
  structure: CharacterStructure
  teachingNotes: string
}

export interface Stroke {
  id: string
  name: string
  d: string
  critiqueId: string
  len: number
  duration: number
}

export interface CharacterStructure {
  centerOfGravity: string
  strokeOrder: number[]
  keyPoints: KeyPoint[]
  similarChars: string[]
}

export interface KeyPoint {
  name: string
  importance: 'low' | 'medium' | 'high'
  commonMistake: string
}
