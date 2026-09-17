import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { generateQuiz } from './gemini.mjs';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT || 3000);
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.png': 'image/png', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8' };

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolveBody, reject) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 100_000) reject(new Error('Request too large'));
    });
    request.on('end', () => {
      try { resolveBody(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON body')); }
    });
    request.on('error', reject);
  });
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
  if (request.method === 'POST' && url.pathname === '/api/generate') {
    try {
      const body = await readJson(request);
      const output = await generateQuiz({ lessonKey: body.lessonKey, task: body.task, caseId: body.caseId });
      sendJson(response, 200, output);
    } catch (error) {
      sendJson(response, error.statusCode || 400, { error: { code: error.code || 'BAD_REQUEST', message: error.message } });
    }
    return;
  }

  if (request.method !== 'GET' || !['/', '/prototype.html'].includes(url.pathname)) {
    sendJson(response, 404, { error: { code: 'NOT_FOUND', message: 'Not found' } });
    return;
  }

  const filePath = resolve(root, 'prototype.html');
  try {
    const content = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(content);
  } catch {
    sendJson(response, 500, { error: { code: 'SERVER_ERROR', message: 'Không đọc được prototype.html.' } });
  }
});

server.listen(port, () => console.log(`VuaTroChoi đang chạy tại http://localhost:${port}`));
