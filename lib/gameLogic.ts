// game-app/lib/gameLogic.ts
import type { Player, Enemy, DifficultyConfig } from '@/types/game'

export const PLAYER_R = 12
export const PLAYER_SPEED = 5

export function getDifficulty(elapsedMs: number): DifficultyConfig {
  if (elapsedMs < 10000) return { spawnInterval: 1000, enemySpeed: 2 }
  if (elapsedMs < 30000) return { spawnInterval: 700, enemySpeed: 3 }
  if (elapsedMs < 60000) return { spawnInterval: 400, enemySpeed: 4 }
  return { spawnInterval: 250, enemySpeed: 5 }
}

export function spawnEnemy(
  canvasW: number,
  canvasH: number,
  playerX: number,
  playerY: number,
  speed: number,
  nextId: number
): Enemy {
  const side = Math.floor(Math.random() * 4)
  let x: number, y: number
  switch (side) {
    case 0: x = Math.random() * canvasW; y = -14; break
    case 1: x = canvasW + 14; y = Math.random() * canvasH; break
    case 2: x = Math.random() * canvasW; y = canvasH + 14; break
    default: x = -14; y = Math.random() * canvasH; break
  }
  const dx = playerX - x
  const dy = playerY - y
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  const r = 6 + Math.random() * 8
  return { id: nextId, x, y, vx: (dx / dist) * speed, vy: (dy / dist) * speed, r }
}

export function updatePlayer(
  player: Player,
  keys: Set<string>,
  canvasW: number,
  canvasH: number
): Player {
  let { x, y } = player
  if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) x -= PLAYER_SPEED
  if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) x += PLAYER_SPEED
  if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) y -= PLAYER_SPEED
  if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) y += PLAYER_SPEED
  return {
    x: Math.max(PLAYER_R, Math.min(canvasW - PLAYER_R, x)),
    y: Math.max(PLAYER_R, Math.min(canvasH - PLAYER_R, y)),
  }
}

export function updateEnemies(enemies: Enemy[], canvasW: number, canvasH: number): Enemy[] {
  return enemies
    .map(e => ({ ...e, x: e.x + e.vx, y: e.y + e.vy }))
    .filter(e => e.x > -50 && e.x < canvasW + 50 && e.y > -50 && e.y < canvasH + 50)
}

export function checkCollision(player: Player, enemies: Enemy[]): boolean {
  return enemies.some(e => {
    const dx = player.x - e.x
    const dy = player.y - e.y
    return Math.sqrt(dx * dx + dy * dy) < PLAYER_R + e.r
  })
}
