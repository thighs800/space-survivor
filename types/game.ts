// game-app/types/game.ts
export type GamePhase = 'start' | 'playing' | 'gameover'

export type Player = {
  x: number
  y: number
}

export type Enemy = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

export type GameState = {
  phase: GamePhase
  player: Player
  enemies: Enemy[]
  score: number
  highScore: number
  startTime: number
}

export type DifficultyConfig = {
  spawnInterval: number
  enemySpeed: number
}
