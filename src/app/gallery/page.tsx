'use client'

import { useState } from 'react'
import { Heart, Download, Eye, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const galleryItems = [
  {
    id: 1,
    title: '亲子阅读时光',
    author: '教育小达人',
    likes: 234,
    views: 1890,
    style: '水彩风格',
    color: 'from-pink-200 to-purple-200',
  },
  {
    id: 2,
    title: '户外探索记',
    author: '自然课堂',
    likes: 186,
    views: 1456,
    style: '卡通插画',
    color: 'from-green-200 to-teal-200',
  },
  {
    id: 3,
    title: '科学小实验',
    author: 'STEM启蒙',
    likes: 312,
    views: 2340,
    style: '扁平风格',
    color: 'from-blue-200 to-indigo-200',
  },
  {
    id: 4,
    title: '情绪小怪兽',
    author: '心理成长',
    likes: 428,
    views: 3200,
    style: '绘本风格',
    color: 'from-yellow-200 to-orange-200',
  },
  {
    id: 5,
    title: '音乐世界',
    author: '艺术启蒙',
    likes: 156,
    views: 980,
    style: '3D卡通',
    color: 'from-purple-200 to-pink-200',
  },
  {
    id: 6,
    title: '亲子瑜伽',
    author: '运动宝妈',
    likes: 267,
    views: 1789,
    style: '简笔画',
    color: 'from-cyan-200 to-blue-200',
  },
  {
    id: 7,
    title: '数学思维训练',
    author: '逻辑达人',
    likes: 198,
    views: 1234,
    style: '扁平插画',
    color: 'from-orange-200 to-red-200',
  },
  {
    id: 8,
    title: '睡前故事',
    author: '绘本妈妈',
    likes: 523,
    views: 4100,
    style: '水彩梦幻',
    color: 'from-indigo-200 to-purple-200',
  },
]

export default function GalleryPage() {
  const [likedItems, setLikedItems] = useState<number[]>([])

  const toggleLike = (id: number) => {
    setLikedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">作品广场</h1>
            <p className="text-gray-600 text-lg">看看其他教育博主们创作的精彩配图</p>
          </div>

          {/* Gallery Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="break-inside-avoid bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div
                  className={`bg-gradient-to-br ${item.color} flex items-center justify-center`}
                  style={{ height: `${200 + (index % 3) * 60}px` }}
                >
                  <Sparkles className="w-10 h-10 text-white/60" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">by {item.author}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {item.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        {item.likes + (likedItems.includes(item.id) ? 1 : 0)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleLike(item.id)}
                        className={`p-1.5 rounded-full transition-colors ${
                          likedItems.includes(item.id)
                            ? 'text-red-500 bg-red-50'
                            : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        <Heart className="w-4 h-4" fill={likedItems.includes(item.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button className="p-1.5 rounded-full text-gray-400 hover:text-edu-purple hover:bg-purple-50 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
