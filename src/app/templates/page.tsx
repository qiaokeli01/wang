'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Search, Filter } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const categories = [
  { id: 'all', name: '全部' },
  { id: 'reading', name: '亲子阅读' },
  { id: 'play', name: '亲子游戏' },
  { id: 'nature', name: '自然探索' },
  { id: 'art', name: '艺术创作' },
  { id: 'science', name: '科学实验' },
  { id: 'emotion', name: '情绪管理' },
  { id: 'habit', name: '习惯养成' },
]

const templates = [
  {
    id: 1,
    title: '温馨亲子阅读时光',
    prompt: '妈妈和孩子在柔软的沙发上一起阅读绘本，温暖的台灯光，温馨的客厅',
    category: 'reading',
    style: '水彩风格',
    color: 'from-pink-100 to-purple-100',
  },
  {
    id: 2,
    title: '户外自然探索',
    prompt: '小朋友拿着放大镜在花园里观察蝴蝶和昆虫，阳光明媚的春天',
    category: 'nature',
    style: '卡通插画',
    color: 'from-green-100 to-emerald-100',
  },
  {
    id: 3,
    title: '趣味科学实验',
    prompt: '爸爸和孩子在厨房做火山爆发实验，小苏打和醋，惊喜的表情',
    category: 'science',
    style: '扁平插画',
    color: 'from-blue-100 to-cyan-100',
  },
  {
    id: 4,
    title: '创意美术课',
    prompt: '一群小朋友围坐在桌边画画，五颜六色的画笔和颜料，快乐的氛围',
    category: 'art',
    style: '卡通风格',
    color: 'from-yellow-100 to-orange-100',
  },
  {
    id: 5,
    title: '情绪认知绘本',
    prompt: '可爱的小熊学习认识不同的情绪，开心、难过、生气、害怕，卡通表情',
    category: 'emotion',
    style: '绘本风格',
    color: 'from-purple-100 to-pink-100',
  },
  {
    id: 6,
    title: '积木搭建游戏',
    prompt: '孩子们一起搭建彩色积木城堡，专注的表情，彩色木质积木',
    category: 'play',
    style: '3D卡通',
    color: 'from-red-100 to-orange-100',
  },
  {
    id: 7,
    title: '晨起好习惯',
    prompt: '小朋友早起刷牙洗脸整理书包，明亮的阳光照进卧室，整洁的房间',
    category: 'habit',
    style: '简笔画',
    color: 'from-sky-100 to-blue-100',
  },
  {
    id: 8,
    title: '睡前故事时间',
    prompt: '星空下妈妈给孩子讲睡前故事，柔和的月光，温馨的卧室，梦幻氛围',
    category: 'reading',
    style: '水彩风格',
    color: 'from-indigo-100 to-purple-100',
  },
  {
    id: 9,
    title: '亲子烘焙时光',
    prompt: '妈妈和女儿一起做曲奇饼干，面粉飞扬，快乐的笑容，温馨的厨房',
    category: 'play',
    style: '卡通插画',
    color: 'from-amber-100 to-yellow-100',
  },
  {
    id: 10,
    title: '植物种植观察',
    prompt: '小朋友在阳台种小植物，浇水施肥，观察种子发芽过程，绿色植物',
    category: 'nature',
    style: '扁平插画',
    color: 'from-lime-100 to-green-100',
  },
  {
    id: 11,
    title: '数学思维游戏',
    prompt: '孩子在玩数学思维桌游，彩色数字方块，专注思考的可爱表情',
    category: 'science',
    style: '扁平插画',
    color: 'from-orange-100 to-red-100',
  },
  {
    id: 12,
    title: '音乐启蒙课',
    prompt: '小朋友们在教室里弹小钢琴和敲小鼓，音符飘扬，快乐的音乐课',
    category: 'art',
    style: '绘本风格',
    color: 'from-rose-100 to-pink-100',
  },
]

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTemplates = templates.filter((t) => {
    const matchCategory = activeCategory === 'all' || t.category === activeCategory
    const matchSearch = t.title.includes(searchQuery) || t.prompt.includes(searchQuery)
    return matchCategory && matchSearch
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">模板中心</h1>
            <p className="text-gray-600 text-lg">精选亲子教育场景模板，点击即可一键生成</p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索模板..."
                className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-edu-purple focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-edu-purple to-edu-pink text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`h-48 bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                  <div className="text-center p-4">
                    <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Sparkles className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium">{template.style}</p>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{template.prompt}</p>
                  <Link
                    href={`/create?prompt=${encodeURIComponent(template.prompt)}`}
                    className="inline-flex items-center text-sm font-medium text-edu-purple hover:text-purple-700 gap-1"
                  >
                    <Sparkles className="w-4 h-4" />
                    使用此模板生成
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Filter className="w-12 h-12 mx-auto mb-3" />
              <p>没有找到匹配的模板</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
