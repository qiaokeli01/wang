import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-edu-pink to-edu-purple rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">巧克力AI绘图</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              专为亲子教育、教育IP博主打造的AI生图工具。<br />
              一键生成精美教育类配图，让内容创作更高效。
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">产品功能</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/create" className="hover:text-white transition-colors">AI生图</a></li>
              <li><a href="/templates" className="hover:text-white transition-colors">模板中心</a></li>
              <li><a href="/gallery" className="hover:text-white transition-colors">作品广场</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">支持</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">使用教程</a></li>
              <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
              <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2024 巧克力AI绘图. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
