import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.AI_API_KEY
  const baseUrl = process.env.AI_BASE_URL
  const model = process.env.AI_MODEL

  const envStatus = {
    hasApiKey: !!apiKey,
    apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'NOT SET',
    baseUrl: baseUrl || 'NOT SET',
    model: model || 'NOT SET',
  }

  // Test API connectivity
  let apiTest = 'not tested'
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    
    const res = await fetch(`${baseUrl}/models`, {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      signal: controller.signal,
    })
    clearTimeout(timeout)
    
    if (res.ok) {
      apiTest = 'connected OK'
    } else {
      const errBody = await res.text().catch(() => '')
      apiTest = `HTTP ${res.status}: ${errBody.substring(0, 200)}`
    }
  } catch (e: any) {
    apiTest = `FAILED: ${e.message}`
  }

  return NextResponse.json({ envStatus, apiTest })
}
