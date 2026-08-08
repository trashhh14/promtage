import { execFile } from 'node:child_process'
import { randomBytes } from 'node:crypto'
import { readFile, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { isAllowedModel, resolveModelId, getDefaultModelId } from '../../shared/llmModels'

const execFileAsync = promisify(execFile)
const buckets = new Map<string, number[]>()

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

export function isRateLimited (ip: string) {
  const now = Date.now()
  const bucket = (buckets.get(ip) || []).filter(time => now - time < 60_000)
  bucket.push(now)
  buckets.set(ip, bucket)
  return bucket.length > 20
}

type UpstreamResult = {
  ok: boolean
  status: number
  text: string
}

function isSecurityPolicyBlock (status: number, text: string) {
  return status === 403 && /security policy/i.test(text)
}

/**
 * OpenRouter (Cloudflare) often blocks Node/curl TLS fingerprints from some networks,
 * while Windows .NET HttpClient still works. Use it as a Windows-only fallback.
 *
 * Important: read/write raw UTF-8 bytes — string decoding in PowerShell mangles Cyrillic.
 */
async function openRouterViaPowerShell (apiKey: string, bodyJson: string): Promise<UpstreamResult> {
  const id = randomBytes(8).toString('hex')
  const bodyPath = join(tmpdir(), `or-body-${id}.json`)
  const outPath = join(tmpdir(), `or-out-${id}.json`)
  const codePath = join(tmpdir(), `or-code-${id}.txt`)

  const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Net.Http
$bodyPath = $env:OR_BODY_PATH
$outPath = $env:OR_OUT_PATH
$codePath = $env:OR_CODE_PATH
$apiKey = $env:OR_API_KEY
$utf8 = [System.Text.UTF8Encoding]::new($false)

try {
  $handler = New-Object System.Net.Http.HttpClientHandler
  $client = New-Object System.Net.Http.HttpClient($handler)
  $client.Timeout = [TimeSpan]::FromMinutes(3)

  $request = New-Object System.Net.Http.HttpRequestMessage(
    [System.Net.Http.HttpMethod]::Post,
    '${OPENROUTER_URL}'
  )
  [void]$request.Headers.TryAddWithoutValidation('Authorization', "Bearer $apiKey")
  [void]$request.Headers.TryAddWithoutValidation('HTTP-Referer', 'http://127.0.0.1:3000')
  [void]$request.Headers.TryAddWithoutValidation('X-Title', 'Viral Script Studio')

  $bodyBytes = [System.IO.File]::ReadAllBytes($bodyPath)
  $content = New-Object System.Net.Http.ByteArrayContent(,$bodyBytes)
  $content.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse('application/json; charset=utf-8')
  $request.Content = $content

  $response = $client.SendAsync($request).GetAwaiter().GetResult()
  $status = [int]$response.StatusCode
  $respBytes = $response.Content.ReadAsByteArrayAsync().GetAwaiter().GetResult()

  [System.IO.File]::WriteAllBytes($outPath, $respBytes)
  [System.IO.File]::WriteAllText($codePath, [string]$status, $utf8)

  $client.Dispose()
  $request.Dispose()
} catch {
  $status = 500
  $msg = $_.Exception.Message
  if ($_.Exception.InnerException) { $msg = $msg + ' | ' + $_.Exception.InnerException.Message }
  [System.IO.File]::WriteAllBytes($outPath, $utf8.GetBytes($msg))
  [System.IO.File]::WriteAllText($codePath, [string]$status, $utf8)
}
`

  await writeFile(bodyPath, bodyJson, 'utf8')

  try {
    await execFileAsync(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-Command', script],
      {
        windowsHide: true,
        maxBuffer: 12 * 1024 * 1024,
        env: {
          ...process.env,
          OR_API_KEY: apiKey,
          OR_BODY_PATH: bodyPath,
          OR_OUT_PATH: outPath,
          OR_CODE_PATH: codePath
        }
      }
    )

    const status = Number.parseInt(await readFile(codePath, 'utf8'), 10) || 500
    const text = await readFile(outPath, 'utf8')
    return { ok: status >= 200 && status < 300, status, text }
  } finally {
    await Promise.allSettled([unlink(bodyPath), unlink(outPath), unlink(codePath)])
  }
}

async function openRouterViaFetch (apiKey: string, bodyJson: string): Promise<UpstreamResult> {
  const upstream = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json; charset=utf-8',
      'HTTP-Referer': 'http://127.0.0.1:3000',
      'X-Title': 'Viral Script Studio'
    },
    body: bodyJson
  })
  const text = await upstream.text()
  return { ok: upstream.ok, status: upstream.status, text }
}

async function callOpenRouter (apiKey: string, payload: Record<string, unknown>): Promise<UpstreamResult> {
  const bodyJson = JSON.stringify(payload)
  const forceShell = process.env.OPENROUTER_TRANSPORT === 'powershell' && process.platform === 'win32'

  if (forceShell) {
    return openRouterViaPowerShell(apiKey, bodyJson)
  }

  const primary = await openRouterViaFetch(apiKey, bodyJson)
  if (primary.ok) return primary

  if (process.platform === 'win32' && isSecurityPolicyBlock(primary.status, primary.text)) {
    return openRouterViaPowerShell(apiKey, bodyJson)
  }

  return primary
}

/**
 * Shared generation path: rate limit, key, model allowlist, OpenRouter call.
 * Callers supply system/user (typically from docs/prompts/*.md + user payload).
 */
export async function generateWithOpenRouter (
  event: any,
  input: {
    system: string
    user: string
    model?: string | null
    plan?: string | null
  }
) {
  const config = useRuntimeConfig()
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'local'

  if (isRateLimited(ip)) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Слишком много запросов. Подождите минуту и попробуйте снова.'
    })
  }

  if (!config.openrouterApiKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'AI-сервер ещё не настроен. Добавьте OPENROUTER_API_KEY в .env.'
    })
  }

  if (!input.system?.trim() || !input.user?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Не хватает данных сценарного движка.'
    })
  }

  const planFallback = input.plan === 'pro' ? config.proModel : config.plusModel
  const model = resolveModelId(input.model, planFallback) || getDefaultModelId()

  if (!model || !isAllowedModel(model)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Выбранная модель недоступна.'
    })
  }

  const upstream = await callOpenRouter(config.openrouterApiKey, {
    model,
    messages: [
      { role: 'system', content: input.system },
      { role: 'user', content: input.user }
    ],
    temperature: 0.85
  })

  let payload: any = {}
  try {
    payload = JSON.parse(upstream.text)
  } catch {
    /* ignore */
  }

  if (!upstream.ok) {
    const rawMessage = payload?.error?.message || payload?.error || payload?.message || upstream.text || 'OpenRouter не смог выполнить запрос.'
    const message = isSecurityPolicyBlock(upstream.status, String(rawMessage))
      ? 'Access denied by security policy (Cloudflare блокирует Node с этой сети). На Windows сервер пробует PowerShell-fallback; если не помогло — VPN EU/US или VPS вне RU.'
      : rawMessage

    throw createError({
      statusCode: upstream.status,
      statusMessage: `OpenRouter ${upstream.status}: ${String(message).slice(0, 500)}`
    })
  }

  const output = payload?.choices?.[0]?.message?.content
  if (!output) {
    throw createError({ statusCode: 502, statusMessage: 'OpenRouter вернул пустой ответ.' })
  }

  return { output, model }
}
