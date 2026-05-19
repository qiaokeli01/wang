import crypto from 'crypto'

// Detect environment: Vercel uses fetch, local dev uses curl for better network compat
const IS_VERCEL = !!process.env.VERCEL

interface RequestOptions {
  url: string
  method?: string
  headers?: Record<string, string>
  body?: string
  timeoutMs?: number
}

interface MultipartField {
  name: string
  value: string | Buffer
  filename?: string
  contentType?: string
}

// ==================== fetch-based (Vercel / serverless) ====================

async function fetchRequest(
  url: string, method: string, headers: Record<string, string>,
  body: string | null, timeoutMs: number,
): Promise<{ status: number; data: any }> {
  console.log(`[API/fetch] ${method} ${url}`)
  const res = await fetch(url, {
    method, headers, body: body ?? undefined,
    signal: AbortSignal.timeout(timeoutMs),
  })
  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  console.log(`[API/fetch] Response: ${res.status}`)
  return { status: res.status, data }
}

async function fetchMultipart(
  url: string, method: string, authHeader: string,
  fields: MultipartField[], timeoutMs: number,
): Promise<{ status: number; data: any }> {
  console.log(`[API/fetch] ${method} ${url} (multipart)`)
  const form = new FormData()
  for (const field of fields) {
    if (field.filename && Buffer.isBuffer(field.value)) {
      const blob = new Blob([field.value], { type: field.contentType || 'application/octet-stream' })
      form.append(field.name, blob, field.filename)
    } else {
      form.append(field.name, String(field.value))
    }
  }
  const res = await fetch(url, {
    method, headers: { 'Authorization': authHeader }, body: form,
    signal: AbortSignal.timeout(timeoutMs),
  })
  const text = await res.text()
  let data: any
  try { data = JSON.parse(text) } catch { data = { raw: text } }
  console.log(`[API/fetch] Response: ${res.status}`)
  return { status: res.status, data }
}

// ==================== curl-based (local dev on Windows) ====================

function curlExec(args: string[], timeoutSec: number): string {
  // Dynamic import to avoid bundling issues on serverless
  const { execFileSync } = require('child_process')
  return execFileSync('curl', args, {
    encoding: 'utf-8',
    timeout: (timeoutSec + 10) * 1000,
    maxBuffer: 50 * 1024 * 1024,
    windowsHide: true,
  })
}

function parseCurlOutput(result: string): { status: number; data: any } {
  const lines = result.trimEnd().split('\n')
  const statusCode = parseInt(lines.pop() || '0', 10)
  const body = lines.join('\n')
  let data: any
  try { data = JSON.parse(body) } catch { data = { raw: body } }
  return { status: statusCode || 200, data }
}

function withRetry<T>(fn: () => T, retries: number, label: string): T {
  let lastErr: any = null
  for (let i = 1; i <= retries; i++) {
    try {
      console.log(`[API/curl] Attempt ${i}/${retries} - ${label}`)
      return fn()
    } catch (err: any) {
      lastErr = err
      console.log(`[API/curl] Attempt ${i} failed: ${(err.stderr || err.message || '').slice(0, 200)}`)
      if (i < retries) {
        const start = Date.now()
        while (Date.now() - start < i * 3000) { /* sync wait */ }
      }
    }
  }
  const msg = lastErr?.stderr || lastErr?.message || ''
  if (msg.includes('timeout')) throw new Error('API连接超时，请检查网络后重试')
  if (msg.includes('reset')) throw new Error('网络连接被重置，请稍后重试')
  throw new Error('网络请求失败，请稍后重试')
}

function curlRequest(
  url: string, method: string, headers: Record<string, string>,
  bodyJson: string | null, timeoutSec: number,
): { status: number; data: any } {
  const fs = require('fs'), os = require('os'), path = require('path')
  const args = [
    '-s', '-S', '-X', method,
    '--max-time', String(timeoutSec), '--connect-timeout', '60',
    '--retry', '2', '--retry-delay', '3', '--retry-connrefused',
    '-w', '\n%{http_code}',
  ]
  for (const [k, v] of Object.entries(headers)) args.push('-H', `${k}: ${v}`)

  let tmpFile: string | null = null
  if (bodyJson) {
    tmpFile = path.join(os.tmpdir(), `choco-req-${Date.now()}.json`)
    fs.writeFileSync(tmpFile, bodyJson, 'utf-8')
    args.push('-d', `@${tmpFile}`)
  }
  args.push(url)

  try {
    const result = withRetry(() => curlExec(args, timeoutSec), 3, `${method} ${url}`)
    const parsed = parseCurlOutput(result)
    console.log(`[API/curl] Response: ${parsed.status}`)
    return parsed
  } finally {
    if (tmpFile && fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile)
  }
}

function curlMultipart(
  url: string, method: string, authHeader: string,
  fields: MultipartField[], timeoutSec: number,
): { status: number; data: any } {
  const fs = require('fs'), os = require('os'), path = require('path')
  const tmpFiles: string[] = []
  const args = [
    '-s', '-S', '-X', method,
    '--max-time', String(timeoutSec), '--connect-timeout', '60',
    '--retry', '2', '--retry-delay', '3', '--retry-connrefused',
    '-w', '\n%{http_code}',
    '-H', `Authorization: ${authHeader}`,
  ]

  for (const field of fields) {
    if (field.filename && Buffer.isBuffer(field.value)) {
      const ext = field.filename.split('.').pop() || 'bin'
      const tmpPath = path.join(os.tmpdir(), `choco-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`)
      fs.writeFileSync(tmpPath, field.value)
      tmpFiles.push(tmpPath)
      args.push('-F', `${field.name}=@${tmpPath};type=${field.contentType || 'application/octet-stream'}`)
    } else {
      args.push('-F', `${field.name}=${String(field.value)}`)
    }
  }
  args.push(url)

  try {
    const result = withRetry(() => curlExec(args, timeoutSec), 3, `${method} ${url} (multipart)`)
    const parsed = parseCurlOutput(result)
    console.log(`[API/curl] Response: ${parsed.status}`)
    return parsed
  } finally {
    for (const f of tmpFiles) { if (fs.existsSync(f)) fs.unlinkSync(f) }
  }
}

// ==================== Public API ====================

export async function apiRequest(options: RequestOptions): Promise<{ status: number; data: any }> {
  const { url, method = 'POST', headers = {}, body, timeoutMs = 180000 } = options
  if (IS_VERCEL) {
    return fetchRequest(url, method, headers, body || null, timeoutMs)
  }
  return curlRequest(url, method, headers, body || null, Math.ceil(timeoutMs / 1000))
}

export async function apiMultipartRequest(options: {
  url: string
  method?: string
  authHeader: string
  fields: MultipartField[]
  timeoutMs?: number
}): Promise<{ status: number; data: any }> {
  const { url, method = 'POST', authHeader, fields, timeoutMs = 180000 } = options
  if (IS_VERCEL) {
    return fetchMultipart(url, method, authHeader, fields, timeoutMs)
  }
  return curlMultipart(url, method, authHeader, fields, Math.ceil(timeoutMs / 1000))
}
