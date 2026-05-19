'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Sparkles } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-edu-pink to-edu-purple rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-edu-purple to-edu-pink bg-clip-text text-transparent">
              巧克力AI绘图
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-edu-purple transition-colors font-medium">
              首页
            </Link>
            <Link href="/create" className="text-gray-700 hover:text-edu-purple transition-colors font-medium">
              AI生图
            </Link>
            <Link href="/templates" className="text-gray-700 hover:text-edu-purple transition-colors font-medium">
              模板中心
            </Link>
            <Link href="/gallery" className="text-gray-700 hover:text-edu-purple transition-colors font-medium">
              作品广场
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/create"
              className="px-5 py-2 bg-gradient-to-r from-edu-purple to-edu-pink text-white rounded-full text-sm font-medium hover:shadow-lg hover:shadow-purple-200 transition-all"
            >
              开始创作
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <Link href="/" className="block text-gray-700 hover:text-edu-purple" onClick={() => setIsOpen(false)}>首页</Link>
            <Link href="/create" className="block text-gray-700 hover:text-edu-purple" onClick={() => setIsOpen(false)}>AI生图</Link>
            <Link href="/templates" className="block text-gray-700 hover:text-edu-purple" onClick={() => setIsOpen(false)}>模板中心</Link>
            <Link href="/gallery" className="block text-gray-700 hover:text-edu-purple" onClick={() => setIsOpen(false)}>作品广场</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
