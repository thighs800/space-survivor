import { renderHook, act } from '@testing-library/react'
import { useHighScore } from '@/hooks/useHighScore'

const KEY = 'space-survivor-high-score'

beforeEach(() => {
  localStorage.clear()
})

describe('useHighScore', () => {
  it('localStorage が空の場合 0 を返す', () => {
    const { result } = renderHook(() => useHighScore())
    expect(result.current.highScore).toBe(0)
  })

  it('localStorage に保存済みのハイスコアを読み込む', () => {
    localStorage.setItem(KEY, '42000')
    const { result } = renderHook(() => useHighScore())
    expect(result.current.highScore).toBe(42000)
  })

  it('スコアがハイスコアを超えた場合に保存する', () => {
    const { result } = renderHook(() => useHighScore())
    act(() => result.current.saveHighScore(30000))
    expect(result.current.highScore).toBe(30000)
    expect(localStorage.getItem(KEY)).toBe('30000')
  })

  it('スコアがハイスコア未満の場合は更新しない', () => {
    localStorage.setItem(KEY, '50000')
    const { result } = renderHook(() => useHighScore())
    act(() => result.current.saveHighScore(20000))
    expect(result.current.highScore).toBe(50000)
    expect(localStorage.getItem(KEY)).toBe('50000')
  })

  it('localStorage が使えない場合もクラッシュしない', () => {
    const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage disabled')
    })
    const { result } = renderHook(() => useHighScore())
    expect(result.current.highScore).toBe(0)
    spy.mockRestore()
  })
})
