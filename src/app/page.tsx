import Link from 'next/link'
import { Sparkles, Palette, BookOpen, Users, Zap, Image, Star, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const features = [
  {
    icon: Palette,
    title: '多种教育风格',
    desc: '卡通插画、扁平风、水彩风、简笔画等多种适合教育内容的画风',
    color: 'from-edu-pink to-edu-purple',
  },
  {
    icon: BookOpen,
    title: '亲子场景模板',
    desc: '预设亲子互动、课堂场景、绘本风格等教育类模板，一键生成',
    color: 'from-edu-blue to-edu-green',
  },
  {
    icon: Zap,
    title: '秒级生成',
    desc: 'AI智能理解教育场景描述，几秒钟即可生成高质量配图',
    color: 'from-edu-yellow to-edu-pink',
  },
  {
    icon: Users,
    title: '博主专属',
    desc: '针对小红书、抖音、公众号等平台尺寸优化，直接发布使用',
    color: 'from-edu-purple to-edu-blue',
  },
]

const showcaseImages = [
  { title: '亲子阅读', style: '温馨插画风', color: 'bg-gradient-to-br from-pink-100 to-purple-100' },
  { title: '科学实验', style: '卡通风格', color: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
  { title: '户外探索', style: '水彩风格', color: 'bg-gradient-to-br from-green-100 to-yellow-100' },
  { title: '音乐启蒙', style: '扁平插画', color: 'bg-gradient-to-br from-purple-100 to-pink-100' },
  { title: '数学思维', style: '简笔画风', color: 'bg-gradient-to-br from-orange-100 to-red-100' },
  { title: '情绪管理', style: '绘本风格', color: 'bg-gradient-to-br from-teal-100 to-blue-100' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm mb-6 animate-fadeIn">
            <Star className="w-4 h-4 text-edu-yellow mr-2" />
            <span className="text-sm text-gray-600">专为亲子教育博主打造</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fadeIn">
            AI一键生成
            <span className="bg-gradient-to-r from-edu-purple to-edu-pink bg-clip-text text-transparent">
              教育类配图
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-fadeIn">
            告别找图烦恼，输入描述即可生成精美的亲子教育插画。
            <br />支持多种风格，适配各大新媒体平台尺寸。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
            <Link
              href="/create"
              className="px-8 py-3 bg-gradient-to-r from-edu-purple to-edu-pink text-white rounded-full font-medium text-lg hover:shadow-xl hover:shadow-purple-200 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              立即体验
            </Link>
            <Link
              href="/templates"
              className="px-8 py-3 bg-white text-gray-700 rounded-full font-medium text-lg hover:shadow-lg transition-all border border-gray-200"
            >
              浏览模板
            </Link>
          </div>

          {/* Hero Image Grid */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {showcaseImages.map((img, i) => (
              <div
                key={i}
                className={`${img.color} rounded-2xl p-6 aspect-square flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer`}
              >
                <Image className="w-10 h-10 text-gray-500 mb-3" />
                <p className="font-medium text-gray-700">{img.title}</p>
                <p className="text-xs text-gray-500 mt-1">{img.style}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              为什么选择巧克力AI绘图？
            </h2>
            <p className="text-gray-600 text-lg">专注教育赛道，让每一张配图都恰到好处</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-gray-100 hover:shadow-xl hover:border-transparent transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feat.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">三步搞定配图</h2>
            <p className="text-gray-600 text-lg">简单三步，从文字到精美插图</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: '输入描述', desc: '用中文描述你想要的教育场景，比如"妈妈和孩子一起读绘本"' },
              { step: '02', title: '选择风格', desc: '挑选卡通、水彩、扁平等风格，选择适合的平台尺寸' },
              { step: '03', title: '一键生成', desc: 'AI秒级生成高清配图，可直接下载用于新媒体内容' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-edu-purple to-edu-pink rounded-full text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-edu-purple to-edu-pink">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">开始创作你的教育配图</h2>
          <p className="text-lg opacity-90 mb-8">加入数千名教育博主，用AI提升内容创作效率</p>
          <Link
            href="/create"
            className="inline-flex items-center px-8 py-3 bg-white text-edu-purple rounded-full font-medium text-lg hover:shadow-xl transition-all gap-2"
          >
            免费开始
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
