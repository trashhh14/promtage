const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const envPath = path.join(root, '.env.local');

function loadLocalEnv() {
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (match && !match[1].startsWith('#')) process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
}
loadLocalEnv();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8'
};

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) body += chunk;
  return JSON.parse(body || '{}');
}

async function generateScenario(request, response) {
  loadLocalEnv();
  const body = await readJson(request);
  const apiKey = process.env.OPENROUTER_API_KEY || body.apiKey;
  if (!apiKey) return sendJson(response, 503, { error: 'Добавьте OPENROUTER_API_KEY в .env.local или вставьте ключ в интерфейс.' });
  if (!body.system || !body.user) return sendJson(response, 400, { error: 'Не хватает данных сценарного движка.' });

  const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': `http://127.0.0.1:${process.env.PORT || 4174}`,
      'X-Title': 'Viral Script Studio'
    },
    body: JSON.stringify({
      model: body.model || 'openrouter/auto',
      messages: [
        { role: 'system', content: body.system },
        { role: 'user', content: body.user }
      ],
      temperature: 0.85
    })
  });

  const payload = await upstream.json().catch(() => ({}));
  if (!upstream.ok) return sendJson(response, upstream.status, { error: payload?.error?.message || 'OpenRouter не смог выполнить запрос.' });
  const output = payload?.choices?.[0]?.message?.content;
  if (!output) return sendJson(response, 502, { error: 'OpenRouter вернул пустой ответ.' });
  sendJson(response, 200, { output });
}

http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    if (request.method === 'POST' && url.pathname === '/api/workflow/scenario') return generateScenario(request, response);
    if (request.method !== 'GET' && request.method !== 'HEAD') return sendJson(response, 405, { error: 'Method not allowed' });

    const relativePath = url.pathname === '/' ? '/index.html' : url.pathname;
    if (relativePath.split('/').some((segment) => segment.startsWith('.'))) return sendJson(response, 404, { error: 'Not found' });
    const filePath = path.resolve(root, `.${relativePath}`);
    if (!filePath.startsWith(root)) return sendJson(response, 403, { error: 'Forbidden' });
    const content = fs.readFileSync(filePath);
    response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream' });
    response.end(content);
  } catch (error) {
    if (error.code === 'ENOENT') return sendJson(response, 404, { error: 'Not found' });
    console.error(error);
    sendJson(response, 500, { error: 'Internal server error' });
  }
}).listen(Number(process.env.PORT || 4174), '127.0.0.1', () => {
  console.log(`Viral Script Studio: http://127.0.0.1:${process.env.PORT || 4174}`);
});
