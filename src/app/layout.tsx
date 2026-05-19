import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '巧克力AI绘图 - 亲子教育博主专属AI生图工具',
  description: '专为亲子教育、教育IP博主打造的AI生图工具，一键生成精美教育类配图',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
