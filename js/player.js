// Плеер тренировки: подход за подходом, таймер, отдых, видео

const player = document.getElementById('player');
const WHO_LABEL = { her: 'Для неё', him: 'Для него' };
const REST_STEP = 15;
const EX_REST_KEY = 'rest:between-exercises';
const EX_REST_DEFAULT = 90;

const run = { steps: [], index: 0, who: null, dayLetter: null, startedAt: 0, timer: null, paused: false, elapsed: 0, left: 0 };

const parseSec = (rest) => parseInt(rest, 10) || 0;

function getExRest() {
  const saved = parseInt(localStorage.getItem(EX_REST_KEY), 10);
  return Number.isNaN(saved) ? EX_REST_DEFAULT : saved;
}

function setExRest(sec) {
  const value = Math.max(0, Math.min(600, sec));
  localStorage.setItem(EX_REST_KEY, String(value));
  return value;
}

const videoOf = (id) => (typeof VIDEOS !== 'undefined' ? VIDEOS[id] : null);

const thumb = (id) => {
  const v = videoOf(id);
  return v ? `<img src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg" alt="" loading="lazy">` : '<div class="thumb-empty">▶</div>';
};

// kind: 'set' — отдых между подходами, 'exercise' — между упражнениями (длительность из настроек)
function buildSteps(day) {
  const steps = [];
  WARMUP.forEach(([id, dose, sec]) => steps.push({ type: 'timed', id, label: 'Разминка', dose, sec }));
  day.items.forEach(([id, sets, reps, rest, note], i) => {
    for (let s = 1; s <= sets; s += 1) {
      steps.push({ type: 'set', id, set: s, sets, reps, note });
      if (s < sets && parseSec(rest) > 0) steps.push({ type: 'rest', kind: 'set', sec: parseSec(rest) });
    }
    if (i < day.items.length - 1) steps.push({ type: 'rest', kind: 'exercise' });
  });
  COOLDOWN.forEach(([id, dose, sec]) => steps.push({ type: 'timed', id, label: 'Заминка', dose, sec }));
  return steps;
}

const restSec = (step) => (step.kind === 'exercise' ? getExRest() : step.sec);

function startWorkout(who, phaseIndex, dayIndex) {
  const day = PLANS[who].phases[phaseIndex].days[dayIndex];
  Object.assign(run, {
    steps: buildSteps(day), index: 0, who, dayLetter: DAY_KEYS[dayIndex], dayIndex,
    title: day.name, startedAt: Date.now(),
  });
  player.classList.remove('overview');
  player.hidden = false;
  document.body.style.overflow = 'hidden';
  renderStep();
}

// Экран перед стартом: состав тренировки, этапы, отдых между упражнениями
const ov = { who: null, phase: 0, day: 0 };

function openOverview(who, phaseIndex, dayIndex) {
  Object.assign(ov, { who, phase: phaseIndex, day: dayIndex });
  clearInterval(run.timer);
  player.classList.add('overview');
  player.hidden = false;
  document.body.style.overflow = 'hidden';
  renderOverview();
}

function ovRow(id, meta, note) {
  return `
    <li><button class="ov-item" data-ex="${id}">
      <div class="next__thumb">${thumb(id)}</div>
      <div class="next__info"><b>${esc(byId[id].name)}</b><span>${esc(meta)}</span>${note ? `<span class="ov-note">${esc(note)}</span>` : ''}</div>
    </button></li>`;
}

function renderOverview() {
  const plan = PLANS[ov.who];
  const phase = plan.phases[ov.phase];
  const day = phase.days[ov.day];
  const cover = videoOf(day.items[0][0]);
  const exRest = fmt(getExRest());
  const main = day.items.map(([id, sets, reps, rest, note], i) => `
    ${ovRow(id, `${formatPlan(sets, reps)} · отдых между подходами ${rest}`, note)}
    ${i < day.items.length - 1 ? `<li class="ov-rest">⏱ Отдых ${exRest} перед следующим упражнением</li>` : ''}`).join('');

  player.innerHTML = `
    <div class="ov-scroll">
      <header class="ov-cover" style="${cover ? `--cover:url(https://i.ytimg.com/vi/${cover.id}/hqdefault.jpg)` : ''}">
        <button class="ov-back" data-action="close" aria-label="Назад">←</button>
        <div class="ov-cover__text">
          <span class="ov-tag">${WHO_LABEL[ov.who]} · ${LEVELS[phase.level]}</span>
          <h2>${workoutLabel(ov.day)} · ${esc(cap(day.name))}</h2>
          <p>≈ 60 минут · ${day.items.length} упражнений · ${esc(phase.weeks)}</p>
        </div>
      </header>
      <nav class="ov-tabs">${plan.phases.map((p, i) =>
    `<button class="${i === ov.phase ? 'active' : ''}" data-ov-phase="${i}">Этап ${i + 1}<small>${esc(p.weeks.replace('Недели ', 'нед. '))}</small></button>`).join('')}</nav>
      <div class="ov-days">${phase.days.map((d, i) =>
    `<button class="${i === ov.day ? 'active' : ''}" data-ov-day="${i}">${workoutLabel(i)}</button>`).join('')}</div>
      <div class="ov-body">
        <details class="ov-block">
          <summary>Разминка · ${WARMUP.length} упражнений · ~10 мин</summary>
          <ul class="ov-list">${WARMUP.map(([id, dose]) => ovRow(id, dose)).join('')}</ul>
        </details>
        <h3 class="ov-title">Основная часть · ${day.items.length} упражнений</h3>
        <ul class="ov-list">${main}</ul>
        <details class="ov-block">
          <summary>Заминка · ${COOLDOWN.length} упражнения · ~10 мин</summary>
          <ul class="ov-list">${COOLDOWN.map(([id, dose]) => ovRow(id, dose)).join('')}</ul>
        </details>
      </div>
    </div>
    <footer class="ov-footer">
      <div class="rest-setting">
        <span>⏱ Отдых между упражнениями</span>
        <button class="step-btn" data-ov-rest="-15">−15 с</button>
        <b>${exRest}</b>
        <button class="step-btn" data-ov-rest="15">+15 с</button>
      </div>
      <button class="ov-start" data-action="start">▶ Начать тренировку</button>
    </footer>`;
}

function closePlayer() {
  clearInterval(run.timer);
  player.hidden = true;
  player.innerHTML = '';
  document.body.style.overflow = '';
}

function beep() {
  try {
    const ac = new AudioContext();
    const osc = ac.createOscillator();
    osc.frequency.value = 880;
    osc.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.25);
  } catch (e) { /* звук недоступен */ }
  navigator.vibrate?.(200);
}

const todo = (text) => (text.startsWith('держать') ? text.replace(/^держать/, 'Держи') : `Сделай ${text}`);

const fmt = (sec) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

function nextExerciseStep(from) {
  return run.steps.slice(from + 1).find((s) => s.type !== 'rest');
}

function stepTitle(step) {
  const ex = byId[step.id];
  if (step.type === 'set') return { name: ex.name, meta: `${formatReps(step.reps)} · подход ${step.set} из ${step.sets}` };
  return { name: ex.name, meta: `${step.label}: ${step.dose}` };
}

function nextUp(from) {
  const next = nextExerciseStep(from);
  if (!next) return '<div class="next"><div class="next__info"><span class="eyebrow">Далее</span><b>Финиш 🎉</b></div></div>';
  const t = stepTitle(next);
  return `
    <div class="next">
      <div class="next__thumb">${thumb(next.id)}</div>
      <div class="next__info"><span class="eyebrow">Далее</span><b>${esc(t.name)}</b><span>${esc(t.meta)}</span></div>
    </div>`;
}

function videoBlock(id) {
  const v = videoOf(id);
  const ex = byId[id];
  if (!v) return `<div class="video video--empty"><a class="btn btn--lime" href="${ytSearch(ex.heria ? `Chris Heria ${ex.en}` : `${ex.en} proper form`)}" target="_blank" rel="noopener">▶ Найти видео на YouTube</a></div>`;
  const src = `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&mute=1&loop=1&playlist=${v.id}&playsinline=1&rel=0&modestbranding=1`;
  return `
    <div class="video"><iframe src="${src}" title="${esc(v.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>
    <a class="video__src" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">${esc(v.author)} · открыть на YouTube ↗</a>`;
}

function queueList() {
  return run.steps.map((s, i) => {
    if (i <= run.index) return '';
    if (s.type === 'rest') {
      const label = s.kind === 'exercise' ? 'Отдых перед следующим упражнением' : 'Отдых между подходами';
      return `<li class="queue__rest ${s.kind === 'exercise' ? 'queue__rest--ex' : ''}">⏱ ${label} · ${fmt(restSec(s))}</li>`;
    }
    const t = stepTitle(s);
    return `<li><button class="queue__item" data-jump="${i}"><div class="next__thumb">${thumb(s.id)}</div><div class="next__info"><b>${esc(t.name)}</b><span>${esc(t.meta)}</span></div></button></li>`;
  }).join('');
}

function shell(content, { button, buttonClass = '' }) {
  const done = run.index;
  const total = run.steps.length;
  const left = total - done - 1;
  player.innerHTML = `
    <div class="player__top">
      <button class="player__close" data-action="close" aria-label="Закрыть">×</button>
      <div class="player__title"><b>${WHO_LABEL[run.who]} · ${workoutLabel(run.dayIndex)}</b><span>${esc(cap(run.title))}</span></div>
      <div class="player__count">${done + 1} / ${total}</div>
    </div>
    <div class="player__progress"><i style="width:${(done / total) * 100}%"></i></div>
    <div class="player__scroll">${content}</div>
    <div class="player__bottom" data-swipe="open">
      <button class="sheet-handle" data-action="sheet-open"><i class="sheet-grip"></i><span>⌃ Вся тренировка · осталось ${left}</span></button>
      ${nextUp(run.index)}
      <button class="player__cta ${buttonClass}" data-action="next">${button}</button>
    </div>
    <div class="sheet-backdrop" data-action="sheet-close"></div>
    <section class="sheet" aria-label="Вся тренировка">
      <div class="sheet__head" data-swipe="close" data-action="sheet-close">
        <i class="sheet-grip"></i>
        <b>⌄ Вся тренировка · осталось ${left}</b>
      </div>
      <ul class="queue">${queueList()}</ul>
    </section>`;
}

function setSheet(open) {
  player.classList.toggle('sheet-open', open);
}

function tick(fn) {
  clearInterval(run.timer);
  run.paused = false;
  run.timer = setInterval(() => {
    if (!run.paused) fn();
  }, 1000);
}

function renderStep() {
  const step = run.steps[run.index];
  if (!step) return renderFinish();
  if (step.type === 'rest') return renderRest(step);

  const ex = byId[step.id];
  const isSet = step.type === 'set';
  const bigReps = String(step.reps || '').split(' / ')[0].replace(/^макс\..*/, 'MAX');
  const head = isSet
    ? `<div class="stage">
        <div><span class="eyebrow">Подход ${step.set} из ${step.sets}</span><h2>${esc(ex.name)}</h2>
          <p class="stage__todo">${esc(todo(formatReps(step.reps)))}</p></div>
        <div class="stage__reps"><span class="eyebrow">${/ с$/.test(bigReps) ? 'Держать' : 'Повторений'}</span><b>${esc(bigReps)}</b></div>
      </div>`
    : `<div class="stage">
        <div><span class="eyebrow">${step.label}</span><h2>${esc(ex.name)}</h2>
          <p class="stage__todo">${esc(todo(step.dose))}</p></div>
        <div class="stage__reps"><span class="eyebrow">Осталось</span><b id="clock-big">${fmt(step.sec)}</b></div>
      </div>`;

  shell(`
    ${head}
    <div class="clock"><span class="eyebrow">${isSet ? 'Время подхода' : 'Таймер'}</span><b id="clock">${isSet ? '00:00' : fmt(step.sec)}</b>
      <button class="chip-btn" data-action="pause">⏸ Пауза</button></div>
    ${videoBlock(step.id)}
    ${step.note ? `<p class="player__note">💡 ${esc(step.note)}</p>` : ''}
    <ul class="player__cues">${ex.cues.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>`,
  { button: isSet ? 'Подход выполнен →' : 'Дальше →' });

  if (isSet) {
    run.elapsed = 0;
    tick(() => {
      run.elapsed += 1;
      document.getElementById('clock').textContent = fmt(run.elapsed);
    });
  } else {
    run.left = step.sec;
    tick(() => {
      run.left -= 1;
      const text = fmt(Math.max(run.left, 0));
      document.getElementById('clock').textContent = text;
      document.getElementById('clock-big').textContent = text;
      if (run.left <= 0) {
        beep();
        go(1);
      }
    });
  }
}

function updateRestView() {
  const ring = player.querySelector('.rest__ring');
  if (!ring) return;
  document.getElementById('rest-clock').textContent = fmt(Math.max(run.left, 0));
  ring.style.setProperty('--p', run.restTotal ? Math.max(run.left, 0) / run.restTotal : 0);
}

function renderRest(step) {
  const sec = restSec(step);
  const isEx = step.kind === 'exercise';
  if (sec <= 0) return go(1);
  run.left = sec;
  run.restTotal = sec;
  run.restKind = step.kind;
  shell(`
    <div class="rest">
      <span class="eyebrow">${isEx ? 'Отдых перед следующим упражнением' : 'Отдых между подходами'}</span>
      <div class="rest__ring" style="--p:1"><b id="rest-clock">${fmt(sec)}</b></div>
      <div class="rest__actions">
        <button class="chip-btn" data-action="minus">−15 с</button>
        <button class="chip-btn" data-action="pause">⏸ Пауза</button>
        <button class="chip-btn" data-action="plus">+15 с</button>
      </div>
      ${isEx
    ? `<p class="rest__setting">Отдых между упражнениями: <b id="ex-rest-value">${fmt(getExRest())}</b><br><span>−15 / +15 меняют и эту настройку для следующих переходов</span></p>`
    : '<p class="muted">Дыши ровно, попей воды. По окончании прозвучит сигнал.</p>'}
    </div>`, { button: 'Пропустить отдых →', buttonClass: 'player__cta--ghost' });

  tick(() => {
    run.left -= 1;
    updateRestView();
    if (run.left <= 0) {
      beep();
      go(1);
    }
  });
}

function adjustRest(delta) {
  run.left = Math.max(0, run.left + delta);
  run.restTotal = Math.max(run.left, run.restTotal + delta, 1);
  if (run.restKind === 'exercise') {
    const value = setExRest(getExRest() + delta);
    document.getElementById('ex-rest-value').textContent = fmt(value);
  }
  updateRestView();
}

function markTracker() {
  const key = trackerKey(run.who);
  const done = JSON.parse(localStorage.getItem(key) || '{}');
  for (let w = 1; w <= 12; w += 1) {
    if (!done[`${w}${run.dayLetter}`]) {
      done[`${w}${run.dayLetter}`] = true;
      localStorage.setItem(key, JSON.stringify(done));
      return w;
    }
  }
  return null;
}

function renderFinish() {
  clearInterval(run.timer);
  setSheet(false);
  const minutes = Math.round((Date.now() - run.startedAt) / 60000);
  const week = markTracker();
  player.innerHTML = `
    <div class="player__top"><button class="player__close" data-action="close" aria-label="Закрыть">×</button></div>
    <div class="finish">
      <div class="finish__icon">✓</div>
      <h2>Тренировка завершена</h2>
      <p>${WHO_LABEL[run.who]} · ${workoutLabel(run.dayIndex)} · ${minutes} мин</p>
      ${week ? `<p class="muted">Отмечено в трекере: неделя ${week}, ${workoutLabel(run.dayIndex).toLowerCase()}.</p>` : ''}
      <button class="player__cta" data-action="close">Готово</button>
    </div>`;
}

function go(delta) {
  run.index = Math.max(0, Math.min(run.steps.length, run.index + delta));
  setSheet(false);
  renderStep();
}

player.addEventListener('click', (e) => {
  if (player.classList.contains('overview')) {
    const t = e.target;
    const phaseBtn = t.closest('[data-ov-phase]');
    const dayBtn = t.closest('[data-ov-day]');
    const restBtn = t.closest('[data-ov-rest]');
    const exBtn = t.closest('[data-ex]');
    const action = t.closest('[data-action]')?.dataset.action;
    if (phaseBtn) {
      ov.phase = Number(phaseBtn.dataset.ovPhase);
      ov.day = Math.min(ov.day, PLANS[ov.who].phases[ov.phase].days.length - 1);
    }
    if (dayBtn) ov.day = Number(dayBtn.dataset.ovDay);
    if (restBtn) setExRest(getExRest() + Number(restBtn.dataset.ovRest));
    if (phaseBtn || dayBtn || restBtn) {
      const open = [...player.querySelectorAll('details')].map((d) => d.open);
      renderOverview();
      player.querySelectorAll('details').forEach((d, i) => { d.open = open[i]; });
    }
    if (exBtn) openExercise(exBtn.dataset.ex);
    if (action === 'close') {
      closePlayer();
      router();
    }
    if (action === 'start') startWorkout(ov.who, ov.phase, ov.day);
    return;
  }
  const jump = e.target.closest('[data-jump]');
  if (jump) {
    go(Number(jump.dataset.jump) - run.index);
    return;
  }
  const action = e.target.closest('[data-action]')?.dataset.action;
  if (action === 'close') {
    if (run.index < run.steps.length && run.index > 0 && !confirm('Прервать тренировку?')) return;
    setSheet(false);
    closePlayer();
    router();
  }
  if (action === 'next') go(1);
  if (action === 'sheet-open') setSheet(true);
  if (action === 'sheet-close') setSheet(false);
  if (action === 'plus') adjustRest(REST_STEP);
  if (action === 'minus') adjustRest(-REST_STEP);
  if (action === 'pause') {
    run.paused = !run.paused;
    e.target.closest('[data-action]').textContent = run.paused ? '▶ Продолжить' : '⏸ Пауза';
  }
});

// Свайп вверх по нижней панели открывает шторку, свайп вниз по её шапке — закрывает
let swipe = null;
player.addEventListener('touchstart', (e) => {
  const zone = e.target.closest('[data-swipe]');
  swipe = zone ? { dir: zone.dataset.swipe, y: e.touches[0].clientY } : null;
}, { passive: true });
player.addEventListener('touchend', (e) => {
  if (!swipe) return;
  const dy = e.changedTouches[0].clientY - swipe.y;
  if (swipe.dir === 'open' && dy < -40) setSheet(true);
  if (swipe.dir === 'close' && dy > 40) setSheet(false);
  swipe = null;
});

document.addEventListener('keydown', (e) => {
  if (player.hidden || player.classList.contains('overview') || !modal.hidden || e.target.closest('button, a')) return;
  if (e.key === 'Escape') setSheet(false);
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    go(1);
  }
  if (e.key === 'ArrowLeft') go(-1);
  if (e.key === 'ArrowUp') setSheet(true);
  if (e.key === 'ArrowDown') setSheet(false);
});
