const app = document.getElementById('app');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');

const byId = Object.fromEntries(EXERCISES.map((ex) => [ex.id, ex]));
const state = { phase: { her: 0, him: 0 }, filters: { q: '', group: '', equip: '', level: '', wrist: false } };

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const workoutLabel = (dayIndex) => `Тренировка ${dayIndex + 1}`;
const DAY_KEYS = 'ABCD';
const TOTAL_SESSIONS = 36;

const ytSearch = (query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

function plural(n, one, few, many) {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
}

const SIDE = { сторона: 'на каждую сторону', нога: 'на каждую ногу', рука: 'на каждую руку' };

// '8–10 / нога' → '8–10 повторений на каждую ногу', '30 с' → 'держать 30 секунд'
function formatReps(reps) {
  const [main, side] = String(reps).split(' / ');
  const tail = side ? ` ${SIDE[side] || `на ${side}`}` : '';
  if (main === 'макс.') return `максимум повторений${tail}`;
  if (main === 'макс. − 1') return `на 1 повтор меньше максимума${tail}`;
  const last = parseInt(main.split('–').pop(), 10);
  if (/ с$/.test(main)) return `держать ${main.replace(/ с$/, '')} ${plural(last, 'секунду', 'секунды', 'секунд')}${tail}`;
  if (/шаг/.test(main)) return `${main}${side === 'сторона' ? ' в каждую сторону' : tail}`;
  return `${main} ${plural(last, 'повторение', 'повторения', 'повторений')}${tail}`;
}

const formatSets = (sets) => `${sets} ${plural(sets, 'подход', 'подхода', 'подходов')}`;

// '3', '30 с' → '3 подхода по 30 секунд'; 'макс.' → '3 подхода на максимум повторений'
function formatPlan(sets, reps) {
  const text = formatReps(reps).replace(/^держать /, '');
  if (text.startsWith('максимум')) return `${formatSets(sets)} на ${text}`;
  if (text.startsWith('на ')) return `${formatSets(sets)} ${text}`;
  return `${formatSets(sets)} по ${text}`;
}

// Где и сколько упражнение делается по планам: для галереи и карточки упражнения
function dosage(id) {
  const out = [];
  [...WARMUP, ...COOLDOWN].forEach(([wid, dose]) => {
    if (wid === id) out.push(`Разминка/заминка: ${dose}`);
  });
  Object.entries(PLANS).forEach(([who, plan]) => {
    plan.phases.forEach((phase, pi) => {
      const item = phase.days.flatMap((d) => d.items).find(([iid]) => iid === id);
      if (item) out.push(`${who === 'her' ? 'Ей' : 'Ему'}, этап ${pi + 1}: ${formatPlan(item[1], item[2])}`);
    });
  });
  return out;
}

function dosageBlock(id) {
  const lines = dosage(id);
  if (!lines.length) return '<p class="dose">Нет в планах — добавляй как замену: 3 подхода по 10–12 повторений.</p>';
  return `<ul class="dose">${lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`;
}

function videoLinks(ex) {
  const video = VIDEOS[ex.id];
  const main = video
    ? `<a class="btn" href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener">▶ Видео</a>`
    : `<a class="btn" href="${ytSearch(ex.heria ? `Chris Heria ${ex.en}` : `${ex.en} proper form`)}" target="_blank" rel="noopener">▶ Найти видео</a>`;
  return `
    ${main}
    <a class="btn btn--ghost" href="${ytSearch(`${ex.name} техника выполнения`)}" target="_blank" rel="noopener">▶ На русском</a>`;
}

function chips(ex) {
  const wrist = ex.wrist === 'ok'
    ? '<span class="chip chip--ok">Кистям ок</span>'
    : '<span class="chip chip--warn">Осторожно с кистями</span>';
  const equip = ex.equip.map((e) => `<span class="chip">${EQUIPMENT[e]}</span>`).join('');
  return `<div class="chips"><span class="chip chip--level">${LEVELS[ex.level]}</span><span class="chip">${GROUPS[ex.group]}</span>${equip}${wrist}</div>`;
}

function openExercise(id) {
  const ex = byId[id];
  modalContent.innerHTML = `
    <h2 style="margin-top:0">${esc(ex.name)}</h2>
    ${chips(ex)}
    <div style="margin-top:16px">${videoBlock(id)}</div>
    <h3 style="margin-top:16px">Сколько делать</h3>
    ${dosageBlock(id)}
    <h3 style="margin-top:16px">Техника</h3>
    <ul>${ex.cues.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    <div class="ex-card__actions" style="margin-top:16px">${videoLinks(ex)}</div>`;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
  modalContent.innerHTML = '';
}

modal.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
app.addEventListener('click', (e) => {
  const link = e.target.closest('[data-ex]');
  if (link) openExercise(link.dataset.ex);
});

const exButton = (id) => `<button class="ex-link" data-ex="${id}">${esc(byId[id].name)}</button>`;

function renderHome() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero__eyebrow">Домашние тренировки · новичок → средний</div>
      <h1>Домашние тренировки на 12 недель</h1>
      <p class="muted">3 тренировки в неделю по часу: 10 минут разминки, 40 минут основной части, 10 минут растяжки.
      Инвентарь: силовая скамья Oxygen Fitness Holton, гантели, резинки, коврик, стойка с турником и брусьями.</p>
    </section>
    <h2>Выбери план</h2>
    <div class="cards">
      <a class="card card--link" href="#her">
        <h3>👩 План для неё</h3>
        <p class="muted">${PLANS.her.profile}</p>
        <p>${PLANS.her.goal}</p>
      </a>
      <a class="card card--link" href="#him">
        <h3>👨 План для него</h3>
        <p class="muted">${PLANS.him.profile}</p>
        <p>${PLANS.him.goal}</p>
      </a>
      <a class="card card--link" href="#gallery">
        <h3>🎬 Галерея упражнений</h3>
        <p class="muted">${EXERCISES.length} упражнений с техникой и видео</p>
        <p>Фильтры по группе мышц, инвентарю, уровню и нагрузке на кисти.</p>
      </a>
    </div>
    <h2>Расписание недели</h2>
    <div class="cards">
      <div class="card"><h3>Пн, Ср, Пт — тренировки</h3><p class="muted">Вт, Чт — отдых, прогулка или йога 20–30 мин. Сб, Вс — отдых.</p></div>
      <div class="card"><h3>Ей — 3 тренировки</h3><p class="muted">Пн — тренировка 1, Ср — тренировка 2, Пт — тренировка 3.</p></div>
      <div class="card"><h3>Ему — 4 тренировки по кругу</h3><p class="muted">Грудь и трицепс → пресс → спина и бицепс → ноги и плечи → снова грудь. Каждый раз — следующая по кругу.</p></div>
    </div>`;
}

function trackerKey(who) {
  return `tracker:${who}`;
}

const readTracker = (who) => JSON.parse(localStorage.getItem(trackerKey(who)) || '{}');
const dayCount = (who) => PLANS[who].phases[0].days.length;
const trackerCols = (who) => Math.ceil(TOTAL_SESSIONS / dayCount(who));

// Следующая тренировка по кругу: первая неотмеченная в порядке 1, 2, 3, 4, 1, 2…
function nextWorkout(who) {
  const done = readTracker(who);
  for (let col = 1; col <= trackerCols(who); col += 1) {
    for (let d = 0; d < dayCount(who); d += 1) {
      if (!done[`${col}${DAY_KEYS[d]}`]) return { col, dayIndex: d };
    }
  }
  return null;
}

function renderTracker(who) {
  const done = readTracker(who);
  const cols = trackerCols(who);
  const colLabel = PLANS[who].rotation ? 'Круг' : 'Неделя';
  const head = Array.from({ length: cols }, (_, i) => `<th>${i + 1}</th>`).join('');
  const rows = [...DAY_KEYS.slice(0, dayCount(who))].map((day, dayIndex) => {
    const cells = Array.from({ length: cols }, (_, i) => {
      const key = `${i + 1}${day}`;
      return `<td><input type="checkbox" data-track="${key}" ${done[key] ? 'checked' : ''} aria-label="${colLabel} ${i + 1}, ${workoutLabel(dayIndex).toLowerCase()}"></td>`;
    }).join('');
    return `<tr><th>${workoutLabel(dayIndex)}</th>${cells}</tr>`;
  }).join('');
  return `
    <h2>Отметки о тренировках</h2>
    <p class="muted">Сохраняются в этом браузере.</p>
    <div class="tracker card"><table><tr><th>${colLabel}</th>${head}</tr>${rows}</table></div>`;
}

function nextBanner(who) {
  const plan = PLANS[who];
  const next = nextWorkout(who);
  if (!plan.rotation || !next) return '';
  const day = plan.phases[state.phase[who]].days[next.dayIndex];
  return `
    <div class="next-banner">
      <div><span class="muted">Следующая по кругу · круг ${next.col}</span><b>${workoutLabel(next.dayIndex)} · ${esc(cap(day.name))}</b></div>
      <button class="btn" data-start="${next.dayIndex}">▶ К тренировке</button>
    </div>`;
}

const doseList = (items) => `<table class="workout">${items.map(([id, dose]) =>
  `<tr><td>${exButton(id)}</td><td colspan="2">${esc(dose)}</td></tr>`).join('')}</table>`;

function renderPlan(who) {
  const plan = PLANS[who];
  const phase = plan.phases[state.phase[who]];
  const tabs = plan.phases.map((p, i) =>
    `<button class="tab ${i === state.phase[who] ? 'active' : ''}" data-phase="${i}">${esc(p.weeks)} · ${esc(p.name.replace(/^Этап \d+\.\s*/, ''))}</button>`).join('');

  const days = phase.days.map((day, dayIndex) => `
    <section class="day card">
      <div class="day__head">
        <div><h3>${workoutLabel(dayIndex)} · ${esc(cap(day.name))}</h3><span class="muted">≈ 60 мин с разминкой и заминкой</span></div>
        <button class="btn" data-start="${dayIndex}">▶ К тренировке</button>
      </div>
      <table class="workout">
        <tr><th>Упражнение</th><th>Сколько делать</th><th>Отдых</th></tr>
        ${day.items.map(([id, sets, reps, rest, note]) => `
          <tr>
            <td>${exButton(id)}${note ? `<span class="note">${esc(note)}</span>` : ''}</td>
            <td>${esc(formatPlan(sets, reps))}</td>
            <td class="num">${esc(rest)}</td>
          </tr>`).join('')}
      </table>
    </section>`).join('');

  app.innerHTML = `
    <h1>${plan.title}</h1>
    <p class="muted">${plan.profile}</p>
    <p>${plan.goal}</p>
    ${nextBanner(who)}
    <div class="tabs">${tabs}</div>
    <div class="rule"><b>${esc(phase.name)}.</b> ${esc(phase.rule)}
      <div class="rest-setting">
        <span>Отдых между упражнениями:</span>
        <button class="step-btn" data-exrest="-15">−15 с</button>
        <b id="exrest">${fmt(getExRest())}</b>
        <button class="step-btn" data-exrest="15">+15 с</button>
      </div>
    </div>
    <section class="day card">
      <h3>Разминка — 10 минут (каждую тренировку)</h3>
      ${doseList(WARMUP)}
      <p class="muted">Плюс 1–2 лёгких подхода первого упражнения.</p>
    </section>
    ${days}
    <section class="day card">
      <h3>Заминка и растяжка — 10 минут</h3>
      ${doseList(COOLDOWN)}
    </section>
    ${renderTracker(who)}`;

  app.querySelectorAll('[data-phase]').forEach((btn) => btn.addEventListener('click', () => {
    state.phase[who] = Number(btn.dataset.phase);
    renderPlan(who);
  }));
  app.querySelectorAll('[data-exrest]').forEach((btn) => btn.addEventListener('click', () => {
    document.getElementById('exrest').textContent = fmt(setExRest(getExRest() + Number(btn.dataset.exrest)));
  }));
  app.querySelectorAll('[data-start]').forEach((btn) => btn.addEventListener('click', () => {
    openOverview(who, state.phase[who], Number(btn.dataset.start));
  }));
  app.querySelectorAll('[data-track]').forEach((box) => box.addEventListener('change', () => {
    const done = JSON.parse(localStorage.getItem(trackerKey(who)) || '{}');
    done[box.dataset.track] = box.checked;
    localStorage.setItem(trackerKey(who), JSON.stringify(done));
  }));
}

function matches(ex) {
  const f = state.filters;
  const q = f.q.trim().toLowerCase();
  return (!q || ex.name.toLowerCase().includes(q) || ex.en.includes(q))
    && (!f.group || ex.group === f.group)
    && (!f.equip || ex.equip.includes(f.equip))
    && (!f.level || ex.level === f.level)
    && (!f.wrist || ex.wrist === 'ok');
}

function renderGalleryList() {
  const list = EXERCISES.filter(matches);
  document.getElementById('gallery-list').innerHTML = list.length ? list.map((ex) => `
    <article class="card ex-card">
      ${VIDEOS[ex.id] ? `<button class="ex-thumb" data-ex="${ex.id}" aria-label="Открыть ${esc(ex.name)}"><img src="https://i.ytimg.com/vi/${VIDEOS[ex.id].id}/mqdefault.jpg" alt="" loading="lazy"><span>▶</span></button>` : ''}
      <h3>${esc(ex.name)}</h3>
      ${chips(ex)}
      ${dosageBlock(ex.id)}
      <ul>${ex.cues.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      <div class="ex-card__actions">${videoLinks(ex)}</div>
    </article>`).join('') : '<p class="muted">Ничего не нашлось — ослабь фильтры.</p>';
  document.getElementById('gallery-count').textContent = `Показано: ${list.length} из ${EXERCISES.length}`;
}

function renderGallery() {
  const f = state.filters;
  const options = (dict, selected) => Object.entries(dict)
    .map(([k, v]) => `<option value="${k}" ${k === selected ? 'selected' : ''}>${v}</option>`).join('');
  app.innerHTML = `
    <h1>Галерея упражнений</h1>
    <p class="muted">Нажми на превью — откроется техника и видео прямо на странице. «На русском» ищет ролики на YouTube.</p>
    <div class="filters">
      <input type="search" id="f-q" placeholder="Поиск: присед, подтягивания…" value="${esc(f.q)}">
      <select id="f-group"><option value="">Все группы</option>${options(GROUPS, f.group)}</select>
      <select id="f-equip"><option value="">Любой инвентарь</option>${options(EQUIPMENT, f.equip)}</select>
      <select id="f-level"><option value="">Любой уровень</option>${options(LEVELS, f.level)}</select>
      <label class="chip" style="display:flex;align-items:center;gap:6px;padding:8px 12px">
        <input type="checkbox" id="f-wrist" ${f.wrist ? 'checked' : ''}> Только без нагрузки на кисти
      </label>
    </div>
    <p id="gallery-count" class="muted"></p>
    <div id="gallery-list" class="cards"></div>`;

  const bind = (id, key, prop = 'value') => document.getElementById(id).addEventListener('input', (e) => {
    state.filters[key] = e.target[prop];
    renderGalleryList();
  });
  bind('f-q', 'q');
  bind('f-group', 'group');
  bind('f-equip', 'equip');
  bind('f-level', 'level');
  bind('f-wrist', 'wrist', 'checked');
  renderGalleryList();
}

function renderBasics() {
  app.innerHTML = `
    <h1>Как тренироваться</h1>
    <div class="cards">
      <div class="card">
        <h3>📈 Прогрессия</h3>
        <p>Двойная прогрессия: держи вес, пока все подходы не выполнены на верхней границе повторов, затем добавь вес и начни с нижней границы.
        Последние 1–3 повтора тяжёлые, но техника не ломается.</p>
      </div>
      <div class="card">
        <h3>🤚 Боль в кисти при отжиманиях</h3>
        <ul>
          <li>Отжимайся на гантелях с гранёными блинами нейтральным хватом — запястье остаётся прямым</li>
          <li>Подтягивайся на параллельных ручках стойки</li>
          <li>Планки — на предплечьях, не на ладонях</li>
          <li>Перед каждой тренировкой — разминка кистей</li>
          <li>Боль не проходит 2–3 недели или усиливается — к травматологу</li>
        </ul>
      </div>
      <div class="card">
        <h3>🧗 Путь к подтягиваниям</h3>
        <p>Лопаточные подтягивания → негативы по 5 секунд → подтягивания с резинкой → много подходов по 1–3 повтора не до отказа.
        Тренировать вертикальную тягу 2–3 раза в неделю.</p>
      </div>
      <div class="card">
        <h3>🏋️ Скамья Holton</h3>
        <p>Спинка регулируется (14 положений): горизонтально — жимы, 30–45° — наклонные жимы и тяга с упором грудью, вертикально — жимы сидя.
        Блоку для ног и парте нужны блины на штырь 51 мм.</p>
      </div>
      <div class="card">
        <h3>🍽 Питание и восстановление</h3>
        <p>Белок ≈ 1,6 г на кг веса: около 100 г в день ей и 115–120 г ему. Сон 7–9 часов.
        Цель — рельеф: небольшой дефицит калорий. Цель — масса: небольшой профицит.</p>
      </div>
      <div class="card">
        <h3>⛔ Когда остановиться</h3>
        <p>Резкая или стреляющая боль, головокружение, боль в суставе (а не жжение в мышце) — прекрати упражнение.
        Пропустил неделю — вернись на шаг назад по весу.</p>
      </div>
    </div>`;
}

const routes = { home: renderHome, her: () => renderPlan('her'), him: () => renderPlan('him'), gallery: renderGallery, basics: renderBasics };

function router() {
  const route = location.hash.slice(1) || 'home';
  (routes[route] || renderHome)();
  document.querySelectorAll('[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === route));
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
router();
