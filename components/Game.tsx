// game-app/components/Game.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { GameCanvas } from './GameCanvas'
import { ScoreBoard } from './ScoreBoard'
import { useGameLoop } from '@/hooks/useGameLoop'
import { useHighScore } from '@/hooks/useHighScore'
import {
  updatePlayer,
  updateEnemies,
  checkCollision,
  getDifficulty,
  spawnEnemy,
} from '@/lib/gameLogic'
import type { GamePhase, Player, Enemy } from '@/types/game'

const CANVAS_SIZE = 580

type InternalState = {
  phase: GamePhase
  player: Player
  enemies: Enemy[]
  score: number
  startTime: number
  lastSpawnTime: number
  nextEnemyId: number
}

function makeInitialState(): InternalState {
  return {
    phase: 'start',
    player: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 },
    enemies: [],
    score: 0,
    startTime: 0,
    lastSpawnTime: 0,
    nextEnemyId: 0,
  }
}

function MobileDpad({
  touchKeys,
}: {
  touchKeys: React.MutableRefObject<Set<string>>
}) {
  const press = (key: string) => touchKeys.current.add(key)
  const release = (key: string) => touchKeys.current.delete(key)

  const btn = (key: string, label: string) => (
    <button
      key={key}
      className="w-14 h-14 bg-slate-700 active:bg-slate-500 text-white rounded-xl text-2xl select-none touch-none"
      onPointerDown={() => press(key)}
      onPointerUp={() => release(key)}
      onPointerLeave={() => release(key)}
    >
      {label}
    </button>
  )

  return (
    <div className="mt-4 grid grid-cols-3 gap-1 md:hidden">
      <div />
      {btn('ArrowUp', '↑')}
      <div />
      {btn('ArrowLeft', '←')}
      {btn('ArrowDown', '↓')}
      {btn('ArrowRight', '→')}
    </div>
  )
}

export function Game() {
  const { highScore, saveHighScore } = useHighScore()
  const keys = useRef<Set<string>>(new Set())
  const touchKeys = useRef<Set<string>>(new Set())
  const stateRef = useRef<InternalState>(makeInitialState())
  const [phase, setPhase] = useState<GamePhase>('start')
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keys.current.add(e.key)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }
    }
    const onKeyUp = (e: KeyboardEvent) => keys.current.delete(e.key)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  const startGame = useCallback(() => {
    const now = Date.now()
    stateRef.current = {
      phase: 'playing',
      player: { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 },
      enemies: [],
      score: 0,
      startTime: now,
      lastSpawnTime: now,
      nextEnemyId: 0,
    }
    setPhase('playing')
    setDisplayScore(0)
  }, [])

  const update = useCallback(() => {
    const s = stateRef.current
    if (s.phase !== 'playing') return

    const now = Date.now()
    const elapsed = now - s.startTime
    const { spawnInterval, enemySpeed } = getDifficulty(elapsed)
    const allKeys = new Set([...keys.current, ...touchKeys.current])

    let enemies = s.enemies
    let { lastSpawnTime, nextEnemyId } = s

    if (now - lastSpawnTime >= spawnInterval) {
      enemies = [...enemies, spawnEnemy(CANVAS_SIZE, CANVAS_SIZE, s.player.x, s.player.y, enemySpeed, nextEnemyId)]
      lastSpawnTime = now
      nextEnemyId += 1
    }

    const player = updatePlayer(s.player, allKeys, CANVAS_SIZE, CANVAS_SIZE)
    const updatedEnemies = updateEnemies(enemies, CANVAS_SIZE, CANVAS_SIZE)

    if (checkCollision(player, updatedEnemies)) {
      saveHighScore(elapsed)
      stateRef.current = { ...s, phase: 'gameover', score: elapsed, player, enemies: updatedEnemies }
      setPhase('gameover')
      setDisplayScore(elapsed)
      return
    }

    stateRef.current = { ...s, player, enemies: updatedEnemies, score: elapsed, lastSpawnTime, nextEnemyId }
    setDisplayScore(elapsed)
  }, [saveHighScore])

  useGameLoop(update, phase === 'playing')

  const s = stateRef.current

  if (phase === 'start') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-6">
        <h1 className="text-5xl font-bold text-cyan-400 tracking-wider">Space Survivor</h1>
        <p className="text-gray-400">四方から迫る敵弾をかわして生き残れ</p>
        <p className="text-yellow-400 text-2xl font-mono">HI&nbsp;{(highScore / 1000).toFixed(1)}s</p>
        <button
          onClick={startGame}
          className="px-10 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xl transition-colors"
        >
          START
        </button>
        <p className="text-gray-600 text-sm">WASD / 矢印キーで移動</p>
      </div>
    )
  }

  if (phase === 'gameover') {
    const isNewRecord = displayScore >= highScore
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white gap-5">
        <h2 className="text-4xl font-bold text-red-400">GAME OVER</h2>
        {isNewRecord && <p className="text-yellow-300 text-xl animate-pulse">★ NEW RECORD ★</p>}
        <p className="text-5xl font-mono text-white">{(displayScore / 1000).toFixed(1)}s</p>
        <p className="text-gray-400 font-mono">HI&nbsp;{(highScore / 1000).toFixed(1)}s</p>
        <button
          onClick={startGame}
          className="px-10 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl text-xl transition-colors"
        >
          RETRY
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950">
      <div className="relative">
        <GameCanvas
          player={s.player}
          enemies={s.enemies}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
        />
        <ScoreBoard score={displayScore} highScore={highScore} />
      </div>
      <MobileDpad touchKeys={touchKeys} />
    </div>
  )
}
