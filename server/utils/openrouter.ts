const buckets = new Map<string, number[]>()

export function isRateLimited (ip: string) {
  const now = Date.now()
  const bucket = (buckets.get(ip) || []).filter(time => now - time < 60_000)
  bucket.push(now)
  buckets.set(ip, bucket)
  return bucket.length > 20
}

export async function proxyOpenRouter (event: any) {
  const config = useRuntimeConfig()
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'local'

  if (isRateLimited(ip)) {
    throw createError({ statusCode: 429, statusMessage: 'Слишком много запросов. Подождите минуту и попробуйте снова.' })
  }

  if (!config.openrouterApiKey) {
    throw createError({ statusCode: 503, statusMessage: 'AI-сервер ещё не настроен. Добавьте OPENROUTER_API_KEY в .env.' })
  }

  const body = await readBody<{ system?: string, user?: string, plan?: string }>(event)
  if (!body?.system || !body?.user) {
    throw createError({ statusCode: 400, statusMessage: 'Не хватает данных сценарного движка.' })
  }

  const model = body.plan === 'pro' ? config.proModel : config.plusModel

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.openrouterApiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Viral Script Studio/nuxt'
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: body.system },
        { role: 'user', content: body.user }
      ],
      temperature: 0.85
    })
  })

  const rawPayload = await upstream.text()
  let payload: any = {}
  try {
    payload = JSON.parse(rawPayload)
  } catch {
    /* ignore */
  }

  if (!upstream.ok) {
    const message = payload?.error?.message || payload?.error || payload?.message || rawPayload || 'OpenRouter не смог выполнить запрос.'
    throw createError({
      statusCode: upstream.status,
      statusMessage: `OpenRouter ${upstream.status}: ${String(message).slice(0, 500)}`
    })
  }

  const output = payload?.choices?.[0]?.message?.content
  if (!output) {
    throw createError({ statusCode: 502, statusMessage: 'OpenRouter вернул пустой ответ.' })
  }

  return { output }
}
