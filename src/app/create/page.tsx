'use client'

import { useState, useRef } from 'react'
import { Sparkles, Download, RefreshCw, Wand2, Image as ImageIcon, Loader2, Upload, X, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const styles = [
  { id: 'cartoon', name: '卡通插画', emoji: '🎨' },
  { id: 'watercolor', name: '水彩风格', emoji: '🌈' },
  { id: 'flat', name: '扁平插画', emoji: '📐' },
  { id: 'pencil', name: '简笔画', emoji: '✏️' },
  { id: 'picturebook', name: '绘本风格', emoji: '📚' },
  { id: '3d', name: '3D卡通', emoji: '🧊' },
  { id: 'anime', name: '动漫风', emoji: '✨' },
  { id: 'realistic', name: '写实风', emoji: '📷' },
]

const sizes = [
  { id: '1:1', name: '1:1 正方形', desc: '小红书/朋友圈' },
  { id: '3:4', name: '3:4 竖版', desc: '小红书笔记' },
  { id: '16:9', name: '16:9 横版', desc: '公众号封面/抖音' },
  { id: '9:16', name: '9:16 竖屏', desc: '短视频/故事' },
]

const promptSuggestions = [
  '妈妈和孩子在温暖的客厅里一起阅读绘本，柔和的灯光',
  '小朋友在户外草地上观察蝴蝶，阳光明媚的春天',
  '爸爸和女儿一起做科学实验，彩色的试管和烧瓶',
  '一群小朋友在教室里开心地画画，五彩缤纷的画笔',
  '亲子瑜伽场景，妈妈带着孩子做伸展运动',
  '小朋友在厨房帮妈妈做饼干，面粉和模具',
]

type TabType = 'text2img' | 'img2img'

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<TabType>('text2img')
  const [prompt, setPrompt] = useState('')
  const [selectedStyle, setSelectedStyle] = useState('cartoon')
  const [selectedSize, setSelectedSize] = useState('1:1')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [negativePrompt, setNegativePrompt] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [error, setError] = useState('')
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [uploadedPreview, setUploadedPreview] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError('')
    setGeneratedImages([])

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: selectedStyle,
          size: selectedSize,
          negativePrompt: negativePrompt.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '生成失败，请重试')
        return
      }

      setGeneratedImages(data.images || [])
    } catch (err: any) {
      setError('网络错误，请检查网络后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleEditImage = async () => {
    if (!prompt.trim() || !uploadedImage) return
    setIsGenerating(true)
    setError('')
    setGeneratedImages([])

    try {
      const formData = new FormData()
      formData.append('image', uploadedImage)
      formData.append('prompt', prompt.trim())
      formData.append('size', selectedSize === '1:1' ? '1024x1024' : selectedSize === '3:4' ? '768x1024' : selectedSize === '16:9' ? '1536x1024' : '1024x1536')

      const res = await fetch('/api/edit-image', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '生成失败，请重试')
        return
      }

      setGeneratedImages(data.images || [])
    } catch (err: any) {
      setError('网络错误，请检查网络后重试')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('图片大小不能超过10MB')
        return
      }
      setUploadedImage(file)
      setUploadedPreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const removeUploadedImage = () => {
    setUploadedImage(null)
    setUploadedPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = async (url: string, index: number) => {
    try {
      const res = await fetch(url)
      const blob = await res.blob()
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `chocolate-ai-${Date.now()}-${index + 1}.png`
      link.click()
      URL.revokeObjectURL(link.href)
    } catch {
      window.open(url, '_blank')
    }
  }

  const handleSubmit = () => {
    if (activeTab === 'text2img') {
      handleGenerate()
    } else {
      handleEditImage()
    }
  }

  const canSubmit = activeTab === 'text2img'
    ? prompt.trim().length > 0
    : prompt.trim().length > 0 && uploadedImage !== null

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Tab Switch */}
              <div className="bg-white rounded-2xl p-2 shadow-sm flex gap-1">
                <button
                  onClick={() => setActiveTab('text2img')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'text2img'
                      ? 'bg-gradient-to-r from-edu-purple to-edu-pink text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Wand2 className="w-4 h-4 inline mr-1" />
                  文生图
                </button>
                <button
                  onClick={() => setActiveTab('img2img')}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === 'img2img'
                      ? 'bg-gradient-to-r from-edu-purple to-edu-pink text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  图生图
                </button>
              </div>

              {/* Image Upload (img2img only) */}
              {activeTab === 'img2img' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    <Upload className="w-4 h-4 inline mr-1" />
                    上传参考图片
                  </label>
                  {uploadedPreview ? (
                    <div className="relative">
                      <img src={uploadedPreview} alt="参考图" className="w-full rounded-xl object-cover max-h-48" />
                      <button
                        onClick={removeUploadedImage}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-edu-purple hover:bg-purple-50/30 transition-all"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">点击上传图片</p>
                      <p className="text-xs text-gray-400 mt-1">支持 JPG/PNG，最大 10MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              )}

              {/* Prompt Input */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Wand2 className="w-4 h-4 inline mr-1" />
                  {activeTab === 'text2img' ? '描述你想要的图片' : '描述你想如何修改图片'}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={activeTab === 'text2img'
                    ? '例如：妈妈和孩子在温暖的客厅里一起阅读绘本...'
                    : '例如：把背景改成户外草地，添加蝴蝶和花朵...'
                  }
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-edu-purple focus:border-transparent outline-none text-sm"
                />
                {activeTab === 'text2img' && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">💡 试试这些提示词：</p>
                    <div className="flex flex-wrap gap-2">
                      {promptSuggestions.slice(0, 3).map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => setPrompt(suggestion)}
                          className="text-xs px-3 py-1.5 bg-purple-50 text-edu-purple rounded-full hover:bg-purple-100 transition-colors truncate max-w-full"
                        >
                          {suggestion.slice(0, 15)}...
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Style Selection (text2img only) */}
              {activeTab === 'text2img' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🎨 选择画风
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {styles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          selectedStyle === style.id
                            ? 'bg-gradient-to-br from-edu-purple to-edu-pink text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-1">{style.emoji}</span>
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  📐 选择尺寸
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`p-3 rounded-xl text-left transition-all ${
                        selectedSize === size.id
                          ? 'bg-gradient-to-br from-edu-purple to-edu-pink text-white shadow-md'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <p className="text-sm font-medium">{size.name}</p>
                      <p className={`text-xs mt-0.5 ${selectedSize === size.id ? 'text-white/80' : 'text-gray-500'}`}>
                        {size.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              {activeTab === 'text2img' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-sm font-medium text-gray-700 flex items-center justify-between w-full"
                  >
                    ⚙️ 高级设置
                    <span className="text-gray-400">{showAdvanced ? '▲' : '▼'}</span>
                  </button>
                  {showAdvanced && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">反向提示词（不想出现的元素）</label>
                        <input
                          value={negativePrompt}
                          onChange={(e) => setNegativePrompt(e.target.value)}
                          placeholder="例如：模糊、低质量、变形..."
                          className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-edu-purple focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || isGenerating}
                className="w-full py-4 bg-gradient-to-r from-edu-purple to-edu-pink text-white rounded-xl font-medium text-lg hover:shadow-xl hover:shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI生成中，请稍候...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {activeTab === 'text2img' ? '生成图片' : '生成修改图'}
                  </>
                )}
              </button>
            </div>

            {/* Right Panel - Results */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm min-h-[600px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">生成结果</h2>
                  {generatedImages.length > 0 && (
                    <button
                      onClick={handleSubmit}
                      disabled={isGenerating}
                      className="text-sm text-edu-purple hover:text-purple-700 flex items-center gap-1 disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4" />
                      重新生成
                    </button>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-700">{error}</p>
                      <button onClick={() => setError('')} className="text-xs text-red-500 mt-1 underline">关闭</button>
                    </div>
                  </div>
                )}

                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-96">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-purple-200 border-t-edu-purple rounded-full animate-spin" />
                      <Sparkles className="w-8 h-8 text-edu-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="mt-4 text-gray-600">AI正在为你创作中...</p>
                    <p className="text-sm text-gray-400 mt-1">大约需要30-60秒，请耐心等待</p>
                  </div>
                ) : generatedImages.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {generatedImages.map((img, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100">
                        <img
                          src={img}
                          alt={`生成图片 ${i + 1}`}
                          className="w-full h-auto object-contain"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleDownload(img, i)}
                            className="px-4 py-2 bg-white rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm font-medium"
                          >
                            <Download className="w-4 h-4 text-gray-700" />
                            下载图片
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-400">
                    <ImageIcon className="w-16 h-16 mb-4" />
                    <p className="text-lg">
                      {activeTab === 'text2img' ? '在左侧输入描述并点击生成' : '上传图片并描述修改内容'}
                    </p>
                    <p className="text-sm mt-1">AI将为你创作精美的教育配图</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
