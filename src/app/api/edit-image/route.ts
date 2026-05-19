import { NextRequest, NextResponse } from 'next/server'
import { apiMultipartRequest } from '@/lib/api-client'

export const maxDuration = 180
export const dynamic = 'force-dynamic'

const API_KEY = process.env.AI_API_KEY
const BASE_URL = process.env.AI_BASE_URL || 'https://xiaoji.baziapi.site/v1'
const MODEL = process.env.AI_MODEL || 'gpt-image-2'

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key 未配置' }, { status: 500 })
    }

    const formData = await req.formData()
    const image = formData.get('image') as File | null
    const prompt = formData.get('prompt') as string
    const size = (formData.get('size') as string) || '1024x1024'

    if (!image) {
      return NextResponse.json({ error: '请上传参考图片' }, { status: 400 })
    }
    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: '请输入修改描述' }, { status: 400 })
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer())
    const ext = image.name.split('.').pop()?.toLowerCase() || 'png'
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'webp' ? 'image/webp' : 'image/png'

    console.log('[EditImage] Calling API...', { model: MODEL, size, imageSize: imageBuffer.length })

    const { status, data } = await apiMultipartRequest({
      url: `${BASE_URL}/images/edits`,
      authHeader: `Bearer ${API_KEY}`,
      fields: [
        { name: 'model', value: MODEL },
        { name: 'image', value: imageBuffer, filename: image.name || `upload.${ext}`, contentType: mimeType },
        { name: 'prompt', value: prompt.trim() },
        { name: 'size', value: size },
        { name: 'n', value: '1' },
      ],
      timeoutMs: 180000,
    })

    console.log('[EditImage] API responded:', status)

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
    console.error('Edit image error:', error.message)
    return NextResponse.json(
      { error: error.message || '服务器内部错误' },
      { status: 500 }
    )
  }
}
