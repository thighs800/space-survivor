// game-app/__tests__/gameLogic.test.ts
import {
  getDifficulty,
  updatePlayer,
  updateEnemies,
  checkCollision,
  PLAYER_R,
  PLAYER_SPEED,
} from '@/lib/gameLogic'

describe('getDifficulty', () => {
  it('0ms で低難易度を返す', () => {
    expect(getDifficulty(0)).toEqual({ spawnInterval: 1000, enemySpeed: 2 })
  })
  it('15000ms で中難易度を返す', () => {
    expect(getDifficulty(15000)).toEqual({ spawnInterval: 700, enemySpeed: 3 })
  })
  it('45000ms で高難易度を返す', () => {
    expect(getDifficulty(45000)).toEqual({ spawnInterval: 400, enemySpeed: 4 })
  })
  it('90000ms で最大難易度を返す', () => {
    expect(getDifficulty(90000)).toEqual({ spawnInterval: 250, enemySpeed: 5 })
  })
})

describe('updatePlayer', () => {
  const W = 600, H = 600

  it('ArrowLeft で左に移動する', () => {
    const result = updatePlayer({ x: 300, y: 300 }, new Set(['ArrowLeft']), W, H)
    expect(result.x).toBe(300 - PLAYER_SPEED)
    expect(result.y).toBe(300)
  })

  it('d キーで右に移動する', () => {
    const result = updatePlayer({ x: 300, y: 300 }, new Set(['d']), W, H)
    expect(result.x).toBe(300 + PLAYER_SPEED)
  })

  it('w キーで上に移動する', () => {
    const result = updatePlayer({ x: 300, y: 300 }, new Set(['w']), W, H)
    expect(result.y).toBe(300 - PLAYER_SPEED)
  })

  it('左壁にクランプする', () => {
    const result = updatePlayer({ x: PLAYER_R - 1, y: 300 }, new Set(['ArrowLeft']), W, H)
    expect(result.x).toBe(PLAYER_R)
  })

  it('右壁にクランプする', () => {
    const result = updatePlayer({ x: W - PLAYER_R + 1, y: 300 }, new Set(['ArrowRight']), W, H)
    expect(result.x).toBe(W - PLAYER_R)
  })

  it('元の player オブジェクトを変更しない（イミュータブル）', () => {
    const player = { x: 300, y: 300 }
    updatePlayer(player, new Set(['ArrowLeft']), W, H)
    expect(player.x).toBe(300)
  })
})

describe('updateEnemies', () => {
  it('速度で位置を更新する', () => {
    const enemies = [{ id: 1, x: 100, y: 100, vx: 2, vy: 3, r: 10 }]
    const result = updateEnemies(enemies, 600, 600)
    expect(result[0].x).toBe(102)
    expect(result[0].y).toBe(103)
  })

  it('画面外に出た敵を削除する', () => {
    const enemies = [{ id: 1, x: -60, y: 100, vx: -5, vy: 0, r: 10 }]
    const result = updateEnemies(enemies, 600, 600)
    expect(result).toHaveLength(0)
  })

  it('元の enemies 配列を変更しない（イミュータブル）', () => {
    const enemies = [{ id: 1, x: 100, y: 100, vx: 2, vy: 3, r: 10 }]
    updateEnemies(enemies, 600, 600)
    expect(enemies[0].x).toBe(100)
  })
})

describe('checkCollision', () => {
  it('プレイヤーと敵が重なっている場合 true を返す', () => {
    const player = { x: 100, y: 100 }
    const enemies = [{ id: 1, x: 100, y: 100, vx: 0, vy: 0, r: 10 }]
    expect(checkCollision(player, enemies)).toBe(true)
  })

  it('プレイヤーと敵が離れている場合 false を返す', () => {
    const player = { x: 100, y: 100 }
    const enemies = [{ id: 1, x: 500, y: 500, vx: 0, vy: 0, r: 10 }]
    expect(checkCollision(player, enemies)).toBe(false)
  })

  it('敵が空配列の場合 false を返す', () => {
    expect(checkCollision({ x: 100, y: 100 }, [])).toBe(false)
  })
})
