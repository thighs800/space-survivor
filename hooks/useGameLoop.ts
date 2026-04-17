'use client'

import { useEffect, useRef, useCallback } from 'react'

export function useGameLoop(update: () => void, active: boolean) {
  const rafId = useRef<number | null>(null)
  const updateRef = useRef(update)
  updateRef.current = update

  const loop = useCallback(() => {
    updateRef.current()
    rafId.current = requestAnimationFrame(loop)
  }, [])

  useEffect(() => {
    if (!active) {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      return
    }
    rafId.current = requestAnimationFrame(loop)
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [active, loop])
}
