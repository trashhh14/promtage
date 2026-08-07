const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' }
});

const buckets = new Map();
function limited(request) {
  const key = request.headers.get('CF-Connecting-IP') || 'anonymous';
  const now = Date.now();
  const times = (buckets.get(key) || []).filter((time) => now - time < 60_000);
  times.push(now); buckets.set(key, times);
  return times.length > 20;
}

async function generate(request, env) {
  if (limited(request)) return json({ error: 'Слишком много запросов. Подождите минуту и попробуйте снова.' }, 429);
  if (!env.OPENROUTER_API_KEY) return json({ error: 'AI-сервер ещё не настроен. Обратитесь к владельцу сервиса.' }, 503);
  let body;
  try { body = await request.json(); } catch (_) { return json({ error: 'Некорректный запрос.' }, 400); }
  if (!body?.system || !body?.user) return json({ error: 'Не хватает данных для генерации.' }, 400);
  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.OPENROUTER_API_KEY}`, 'content-type': 'application/json', 'X-Title': 'Viral Script Studio' },
    body: JSON.stringify({ model: body.plan === 'pro' ? (env.PRO_MODEL || 'anthropic/claude-sonnet-4') : (env.PLUS_MODEL || 'google/gemini-3.5-flash-lite'), messages: [{ role: 'system', content: body.system }, { role: 'user', content: body.user }], temperature: 0.85 })
  });
  const raw = await upstream.text();
  let payload = {}; try { payload = JSON.parse(raw); } catch (_) { }
  if (!upstream.ok) return json({ error: `OpenRouter ${upstream.status}: ${payload?.error?.message || payload?.error || raw || 'Ошибка запроса.'}` }, upstream.status);
  const output = payload?.choices?.[0]?.message?.content;
  return output ? json({ output }) : json({ error: 'Модель вернула пустой ответ.' }, 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true, serverKeyConfigured: Boolean(env.OPENROUTER_API_KEY), acceptsBrowserKey: false });
    if (request.method === 'POST' && (url.pathname === '/api/workflow/scenario' || url.pathname === '/api/workflow/storyboard')) return generate(request, env);
    return env.ASSETS.fetch(request);
  }
};
