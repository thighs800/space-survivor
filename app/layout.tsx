import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Space Survivor',
  description: 'リアルタイム弾幕避けゲーム — 生き残れ！',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-950">{children}</body>
    </html>
  )
}
