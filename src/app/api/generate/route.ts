import { NextRequest, NextResponse } from 'next/server'
import { apiRequest } from '@/lib/api-client'

export const maxDuration = 180
export const dynamic = 'force-dynamic'

const API_KEY = process.env.AI_API_KEY
const BASE_URL = process.env.AI_BASE_URL || 'https://xiaoji.baziapi.site/v1'
const MODEL = process.env.AI_MODEL || 'gpt-image-2'

const STYLE_PROMPTS: Record<string, string> = {
  cartoon: ', cartoon illustration style, vibrant colors, cute characters',
  watercolor: ', watercolor painting style, soft colors, artistic brush strokes',
  flat: ', flat design illustration, clean lines, minimalist, modern',
  pencil: ', simple pencil sketch style, line drawing, black and white with light color',
  picturebook: ', children picture book illustration, warm colors, storybook style',
  '3d': ', 3D cartoon render, Pixar style, soft lighting, cute',
  anime: ', anime style illustration, Japanese animation, colorful',
  realistic: ', realistic digital art, photorealistic, detailed, high quality',
}

const SIZE_MAP: Record<string, string> = {
  '1:1': '1024x1024',
  '3:4': '768x1024',
  '16:9': '1536x1024',
  '9:16': '1024x1536',
}

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 })
    }

    const body = await req.json()
    const { prompt, style, size, negativePrompt } = body

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: '请输入图片描述' }, { status: 400 })
    }

    const stylePrompt = STYLE_PROMPTS[style] || ''
    const negPrompt = negativePrompt ? `. Avoid: ${negativePrompt}` : ''
    const fullPrompt = `${prompt.trim()}${stylePrompt}${negPrompt}`
    const imageSize = SIZE_MAP[size] || '1024x1024'

    console.log('[Generate] Calling API...', { model: MODEL, size: imageSize })

    const { status, data } = await apiRequest({
      url: `${BASE_URL}/images/generations`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: fullPrompt,
        n: 1,
        size: imageSize,
      }),
      timeoutMs: 180000,
    })

    console.log('[Generate] API responded:', status)

    if (status >= 400) {
      const errorMsg = data?.error?.message || `API请求失败 (${status})`
      return NextResponse.json({ error: errorMsg }, { status })
    }

    const images = data.data?.map((item: any) => item.url).filter(Boolean) || []

    if (images.length === 0) {
      return NextResponse.json({ error: '未能生成图片，请重试' }, { status: 500 })
    }

    return NextResponse.json({ images, model: data.model || MODEL })
  } catch (error: any) {
    console.error('Generate error:', error.message)
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    )
  }
}
