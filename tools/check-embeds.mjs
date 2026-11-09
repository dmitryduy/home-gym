// Проверяет, что каждый ролик из js/videos.js реально проигрывается во встроенном плеере.
// Нужен запущенный локальный сервер: python3 -m http.server 8765 --bind 127.0.0.1
// Запуск: node tools/check-embeds.mjs — печатает JSON со списком неработающих id упражнений
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import vm from 'node:vm';

const ctx = {};
vm.runInNewContext(`${fs.readFileSync('js/videos.js', 'utf8')}; this.VIDEOS = VIDEOS;`, ctx);
const entries = Object.entries(ctx.VIDEOS);

const PORT = 9335;
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--no-proxy-server', '--use-mock-keychain', `--remote-debugging-port=${PORT}`, '--window-size=1400,1000',
  '--user-data-dir=/tmp/ws-embed-check', '--site-per-process', 'about:blank',
]);

let targets;
for (let i = 0; i < 90 && !targets; i += 1) {
  await new Promise((r) => setTimeout(r, 500));
  targets = await fetch(`http://127.0.0.1:${PORT}/json`).then((r) => r.json()).catch(() => null);
}

const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
let seq = 0;
const pending = new Map();
ws.addEventListener('message', (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) pending.get(msg.id)(msg);
});
const send = (method, params = {}, sessionId) => new Promise((r) => {
  seq += 1;
  pending.set(seq, r);
  ws.send(JSON.stringify({ id: seq, method, params, ...(sessionId && { sessionId }) }));
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

await send('Page.enable');
const broken = [];
const BATCH = 8;
const page = 'embed-check.html';

for (let i = 0; i < entries.length; i += BATCH) {
  const batch = entries.slice(i, i + BATCH);
  const html = batch.map(([, v]) => `<iframe width="320" height="180" src="https://www.youtube-nocookie.com/embed/${v.id}?mute=1" referrerpolicy="strict-origin-when-cross-origin"></iframe>`).join('');
  fs.writeFileSync(page, `<html><body>${html}</body></html>`);
  await send('Page.navigate', { url: `http://127.0.0.1:8765/embed-check.html?b=${i}` });
  await sleep(7000);

  const { result } = await send('Target.getTargets');
  for (const [exId, v] of batch) {
    const frame = result.targetInfos.find((t) => t.type === 'iframe' && t.url.includes(v.id));
    if (!frame) {
      broken.push({ exId, id: v.id, why: 'iframe не найден' });
      continue;
    }
    const { result: att } = await send('Target.attachToTarget', { targetId: frame.targetId, flatten: true });
    const text = (await send('Runtime.evaluate', { expression: 'document.body.innerText', returnByValue: true }, att.sessionId)).result?.result?.value || '';
    await send('Target.detachFromTarget', { sessionId: att.sessionId });
    if (/video is unavailable|видео недоступно|an error occurred|произошла ошибка/i.test(text)) broken.push({ exId, id: v.id, why: text.split('\n')[0] });
  }
  process.stderr.write(`проверено ${Math.min(i + BATCH, entries.length)} / ${entries.length}\n`);
}

fs.unlinkSync(page);
chrome.kill();
console.log(JSON.stringify(broken, null, 2));
process.exit(0);
