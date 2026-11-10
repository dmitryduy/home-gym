// Подбирает короткие YouTube-ролики с показом упражнения, пишет js/videos.js
// Запуск: node tools/find-videos.mjs [id ...] — без аргументов перебирает все упражнения
// После подбора прогнать tools/check-embeds.mjs: часть роликов не играет во встроенном плеере
import fs from 'node:fs';
import vm from 'node:vm';

const ctx = {};
const existing = fs.existsSync('js/videos.js') ? fs.readFileSync('js/videos.js', 'utf8') : 'const VIDEOS = {};';
vm.runInNewContext(`${fs.readFileSync('js/data.js', 'utf8')}; ${existing}; this.EXERCISES = EXERCISES; this.VIDEOS = VIDEOS;`, ctx);

const MAX_SEC = 75;
const MIN_IDEAL_SEC = 8;
const IDEAL_SEC = 45;
const HERIA = /thenx|chris heria/i;
const HEADERS = { 'Accept-Language': 'en', Cookie: 'CONSENT=YES+1; SOCS=CAI' };
const STOP_WORDS = new Set(['dumbbell', 'how', 'proper', 'form', 'exercise', 'tutorial', 'machine', 'resistance', 'yoga', 'pose', 'with', 'the']);

// Свой запрос и обязательное слово в названии, где автоподбор промахивается
const OVERRIDES = {
  'wrist-warmup': { q: 'wrist warm up mobility', must: /wrist/i },
  'worlds-greatest': { q: 'worlds greatest stretch', must: /greatest/i },
  'cossack-squat': { must: /cossack/i },
  'jump-squat': { must: /jump squat/i },
  pushup: { q: 'push up form', must: /push.?up/i },
  'band-dip': { q: 'band assisted dips', must: /dip/i },
  'negative-dip': { q: 'negative dips', must: /negative|eccentric/i },
  dip: { q: 'parallel bar dips form', must: /dip/i },
  'band-pullup': { q: 'band assisted pull up', must: /band|assist/i },
  'negative-pullup': { q: 'negative pull ups', must: /negative|eccentric/i },
  'neutral-pullup': { q: 'neutral grip pull up', must: /neutral|parallel/i },
  chinup: { q: 'chin up form', must: /chin.?up/i },
  'pike-pushup': { must: /pike/i },
  'tuck-lsit': { q: 'tuck l sit', must: /l.?sit|tuck/i },
  'hanging-knee-raise': { must: /knee/i },
  'dead-hang': { q: 'dead hang', must: /hang/i },
  'scap-pullup': { q: 'scapular pull ups', must: /scap/i },
  'box-pistol': { q: 'box pistol squat', must: /pistol/i },
  'glute-bridge': { q: 'glute bridge', must: /bridge/i },
  'db-pushup': { q: 'push ups on dumbbells', must: /push.?up/i },
  'deficit-pushup': { must: /deficit/i },
  superman: { q: 'prone y t w raise', must: /\by\b|ytw|y-t-w|y t w|raise/i },
  'band-pulldown': { q: 'band lat pulldown', must: /pull.?down/i },
  'leg-extension': { must: /extension/i },
  'leg-curl': { q: 'lying leg curl', must: /curl/i },
};

// Ролики, которые не проигрываются во встроенном плеере (см. tools/check-embeds.mjs)
const EXCLUDE = new Set(['9M8ylnbriB0', 'IfESGr170DY', 'LORVjN2bg5o', 'eG20L9cl81w', 'fUGQ7oMEIFI',
  'V01aVqxOhbU', 'rA_cC0Y6TWI', 'lpBiGVoUFMA', 'vm0zV_WQerE', 'nHbNc-WwLU8', 'YO9bbyrgJkI', 'L91QMACdA6Q', 'RDFL4Bh2SSY',
  // Не показ техники
  'HLyDdQUsC1U']);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      return await (await fetch(url, { headers: HEADERS })).text();
    } catch (e) {
      await sleep(3000 * attempt);
    }
  }
  return '';
}

async function search(query) {
  const html = await get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
  return [...new Set([...html.matchAll(/"videoId":"([\w-]{11})"/g)].map((m) => m[1]))].slice(0, 10);
}

async function details(id) {
  const html = await get(`https://www.youtube.com/watch?v=${id}`);
  const seconds = parseInt(html.match(/"lengthSeconds":"(\d+)"/)?.[1], 10);
  const embeddable = /"playableInEmbed":true/.test(html) && /"playabilityStatus":\{"status":"OK"/.test(html);
  const title = html.match(/<meta name="title" content="([^"]*)"/)?.[1]
    ?.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const author = html.match(/"ownerChannelName":"([^"]*)"/)?.[1];
  return { id, seconds, embeddable, title, author };
}

const keywords = (en) => en.toLowerCase().split(/\W+/).filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

function score(ex, c) {
  const title = (c.title || '').toLowerCase();
  const hits = keywords(ex.en).filter((w) => title.includes(w)).length;
  if (!hits) return -1;
  const ideal = c.seconds >= MIN_IDEAL_SEC && c.seconds <= IDEAL_SEC;
  return hits * 100 + (ideal ? 50 : 0) + (HERIA.test(c.author) ? 30 : 0) - c.seconds / 5;
}

const only = process.argv.slice(2);
const result = { ...ctx.VIDEOS };

for (const ex of ctx.EXERCISES) {
  if (only.length && !only.includes(ex.id)) continue;
  const override = OVERRIDES[ex.id] || {};
  const query = `${override.q || ex.en} shorts`;
  const candidates = [];
  for (const id of await search(query)) {
    if (EXCLUDE.has(id)) continue;
    const c = await details(id);
    if (!c.embeddable || !c.seconds || c.seconds > MAX_SEC || !c.title) continue;
    if (override.must && !override.must.test(c.title)) continue;
    candidates.push(c);
  }
  const best = candidates.map((c) => ({ ...c, s: score(ex, c) })).filter((c) => c.s >= 0).sort((a, b) => b.s - a.s)[0];
  if (best) result[ex.id] = { id: best.id, title: best.title, author: best.author, seconds: best.seconds };
  await sleep(500);
  console.log(`${ex.id.padEnd(24)} ${best ? `${best.id} | ${String(best.seconds).padStart(3)} с | ${best.author} | ${best.title}` : `— коротких нет, оставлен прежний (${result[ex.id]?.seconds ?? '?'} с)`}`);
}

Object.values(result).forEach((v) => {
  v.title = v.title.replace(/\\u0026/g, '&');
  v.author = v.author.replace(/\\u0026/g, '&');
});

fs.writeFileSync('js/videos.js', `// Сгенерировано tools/find-videos.mjs: короткие ролики, проверенные на встраивание\nconst VIDEOS = ${JSON.stringify(result, null, 2)};\n`);
