'use client'

import { useEffect, useRef } from 'react'
import type { Player, Enemy } from '@/types/game'

type Props = {
  player: Player
  enemies: Enemy[]
  width: number
  height: number
}

export function GameCanvas({ player, enemies, width, height }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, width, height)

    // 背景の星（静的）
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    for (let i = 0; i < 60; i++) {
      ctx.fillRect((i * 137 + 31) % width, (i * 97 + 17) % height, 1.5, 1.5)
    }

    // 敵（赤い円）
    enemies.forEach(e => {
      ctx.beginPath()
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
      ctx.fillStyle = '#ff3333'
      ctx.shadowBlur = 12
      ctx.shadowColor = '#ff0000'
      ctx.fill()
    })

    // プレイヤー（シアンの円）
    ctx.beginPath()
    ctx.arc(player.x, player.y, 12, 0, Math.PI * 2)
    ctx.fillStyle = '#00ccff'
    ctx.shadowBlur = 18
    ctx.shadowColor = '#00ccff'
    ctx.fill()

    ctx.shadowBlur = 0
  }, [player, enemies, width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="rounded-xl border border-slate-700"
    />
  )
}
