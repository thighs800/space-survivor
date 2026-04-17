'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'space-survivor-high-score'

export function useHighScore() {
  const [highScore, setHighScore] = useState<number>(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setHighScore(parseInt(stored, 10))
    } catch {}
  }, [])

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
