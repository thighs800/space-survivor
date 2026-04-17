'use client'

import { useState, useCallback } from 'react'

const STORAGE_KEY = 'space-survivor-high-score'

export function useHighScore() {
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? parseInt(stored, 10) : 0
    } catch {
      return 0
    }
  })

  const saveHighScore = useCallback((score: number) => {
    setHighScore(prev => {
      if (score <= prev) return prev
      try {
        localStorage.setItem(STORAGE_KEY, String(score))
      } catch {}
      return score
    })
  }, [])

  return { highScore, saveHighScore }
}
