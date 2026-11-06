git /* ============================================================
   ZONK! PPKn Challenge — logika permainan
   ------------------------------------------------------------
   Alur:
   pembuka -> game (shuffle -> pilih cup)
     - ketemu bola : +1 poin, bola disembunyikan lagi, shuffle
     - ZONK        : cup keluar, soal PPKn muncul
                     -> jawab / skip -> COBA LAGI
                     -> cup pengganti masuk -> shuffle
   -> hasil setelah 25 soal terpakai
   ============================================================ */

'use strict';

/* ============================================================
   1. KONFIGURASI
   ============================================================ */
const CONFIG = {
  TOTAL_CUP: 6,
  TOTAL_SOAL: 25,

  POIN_PER_BOLA: 1,
  NILAI_BENAR: 4,
  NILAI_SKIP: 2,
  BIAYA_SKIP: 1,

  SHUFFLE: {
    // 9-10 pertukaran x 80-95 ms + jeda = sekitar 1-1,3 detik
    cepat: { minSwap: 9, maxSwap: 10, minDur: 80, maxDur: 95, settle: 310 },
    // 10-11 pertukaran x 95-110 ms + jeda = sekitar 1,3-1,5 detik
    normal: { minSwap: 10, maxSwap: 11, minDur: 95, maxDur: 110, settle: 340 }
  }
};

const LETTERS = 'ABCD';

/* ============================================================
   2. STATE
   ============================================================ */
const state = {
  session: 0,
  screen: 'start',
  phase: 'idle', // idle | shuffling | choosing | revealing | question | resolved | transitioning | result

  cups: [],
  layout: null,
  ballCupId: null,
  removedSlot: null,

  poin: 0,
  nilai: 0,
  benar: 0,
  salah: 0,
  skip: 0,
  bolaDitemukan: 0,

  soalDeck: [],
  soalIndex: 0,
  activeSoal: null,
  selectedOption: null,
  questionResolved: false,

  speed: 'cepat',
  muted: false,
  busy: false,

  closeTimer: null,
  bannerTimer: null,
  toastTimer: null
};

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

/* ============================================================
   3. UTILITAS
   ============================================================ */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Fisher-Yates — dipakai untuk soal, bukan untuk cup */
function shuffleArray(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

/* ============================================================
   4. SUARA (Web Audio, tanpa aset eksternal)
   ============================================================ */
let audioCtx = null;

function ensureAudio() {
  if (state.muted) return null;
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      audioCtx = new AC();
    } catch (err) {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function tone(freq, dur, type = 'sine', vol = 0.05, delay = 0, slideTo = null) {
  if (state.muted) return;
  const ctx = ensureAudio();
  if (!ctx) return;
  try {
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur);
    }
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, vol), t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.03);
  } catch (err) {
    /* audio tidak boleh menghentikan permainan */
  }
}

const sfx = {
  click: () => tone(540, 0.05, 'square', 0.03),
  tick: () => tone(280 + Math.random() * 180, 0.03, 'square', 0.018),
  success: () => {
    tone(523, 0.1, 'sine', 0.06);
    tone(659, 0.1, 'sine', 0.06, 0.08);
    tone(784, 0.2, 'sine', 0.07, 0.16);
  },
  zonk: () => {
    tone(210, 0.26, 'sawtooth', 0.05, 0, 90);
    tone(120, 0.34, 'square', 0.045, 0.1, 65);
  },
  correct: () => {
    tone(660, 0.09, 'triangle', 0.06);
    tone(880, 0.15, 'triangle', 0.06, 0.075);
  },
  wrong: () => {
    tone(230, 0.15, 'square', 0.045);
    tone(150, 0.22, 'square', 0.045, 0.11);
  },
  skip: () => {
    tone(520, 0.08, 'triangle', 0.05);
    tone(720, 0.13, 'triangle', 0.05, 0.07);
  },
  whoosh: () => tone(180, 0.24, 'sine', 0.03, 0, 520),
  fanfare: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'sine', 0.06, i * 0.1))
};

/* ============================================================
   5. PREFERENSI (kecepatan & suara)
   ============================================================ */
function loadPrefs() {
  try {
    const speed = localStorage.getItem('zonk-speed');
    if (speed === 'normal' || speed === 'cepat') state.speed = speed;
    const muted = localStorage.getItem('zonk-muted');
    if (muted === '1') state.muted = true;
  } catch (err) {
    /* localStorage bisa diblokir; abaikan */
  }
}

function setSpeed(speed) {
  state.speed = speed === 'normal' ? 'normal' : 'cepat';
  $$('.speed-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.speed === state.speed);
  });
  try {
    localStorage.setItem('zonk-speed', state.speed);
  } catch (err) { /* abaikan */ }
}

function setMuted(muted) {
  state.muted = Boolean(muted);
  const btn = $('#btn-mute');
  btn.setAttribute('aria-pressed', state.muted ? 'true' : 'false');
  btn.setAttribute('aria-label', state.muted ? 'Nyalakan suara' : 'Matikan suara');
  btn.title = state.muted ? 'Nyalakan suara' : 'Matikan suara';
  $('#mute-icon').textContent = state.muted ? '🔇' : '🔊';
  try {
    localStorage.setItem('zonk-muted', state.muted ? '1' : '0');
  } catch (err) { /* abaikan */ }
}

/* ============================================================
   6. TATA LETAK CUP
   ============================================================ */
const CUP_SVG = `
<svg class="cup-svg" viewBox="0 0 120 132" aria-hidden="true" focusable="false">
  <path d="M16 30 Q16 22 60 22 Q104 22 104 30 L111 108 Q111 121 60 121 Q9 121 9 108 Z"
        fill="url(#cupGrad)" stroke="#081026" stroke-width="3.5" stroke-linejoin="round"></path>
  <ellipse cx="60" cy="30" rx="44" ry="11" fill="url(#cupRim)" stroke="#081026" stroke-width="3.5"></ellipse>
  <ellipse cx="60" cy="30" rx="30" ry="6.5" fill="#07102a" opacity="0.62"></ellipse>
  <path d="M27 44 Q21 74 25 104" fill="none" stroke="rgba(255,255,255,0.34)" stroke-width="5" stroke-linecap="round"></path>
  <path d="M93 46 Q98 72 95 100" fill="none" stroke="rgba(0,0,0,0.28)" stroke-width="5" stroke-linecap="round"></path>
</svg>`;

function computeLayout() {
  const stage = $('#cup-stage');
  const width = stage.clientWidth || 900;
  const compact = width < 580;

  const cols = compact ? 3 : 6;
  const rows = Math.ceil(CONFIG.TOTAL_CUP / cols);

  const inset = compact ? 10 : 24;
  const gapX = compact ? 12 : Math.min(30, width * 0.03);
  const cupW = Math.max(72, Math.floor((width - inset * 2 - gapX * (cols - 1)) / cols));
  const cupH = Math.round(cupW * 1.12);

  const topPad = compact ? 58 : 74;
  const gapY = compact ? 18 : 0;
  const bottomPad = compact ? 16 : 14;

  const height = topPad + rows * cupH + (rows - 1) * gapY + bottomPad;

  stage.style.height = `${height}px`;
  stage.style.setProperty('--cup-w', `${cupW}px`);
  stage.style.setProperty('--cup-h', `${cupH}px`);

  const totalW = cols * cupW + (cols - 1) * gapX;
  const startX = Math.round((width - totalW) / 2);
  const positions = [];

  for (let slot = 0; slot < CONFIG.TOTAL_CUP; slot += 1) {
    const row = Math.floor(slot / cols);
    const col = slot % cols;
    positions.push({
      x: Math.round(startX + col * (cupW + gapX)),
      y: Math.round(topPad + row * (cupH + gapY))
    });
  }

  return { positions, cupW, cupH, compact, cols, rows };
}

function cupTransform(cup, pos) {
  return `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${cup.tilt}deg)`;
}

function setCupPos(cup, pos, duration) {
  if (duration > 0) {
    cup.el.style.transition = `transform ${duration}ms cubic-bezier(0.32, 0.72, 0.24, 1), opacity 0.3s ease`;
  } else {
    cup.el.style.transition = 'none';
  }
  cup.el.style.transform = cupTransform(cup, pos);
  cup.el.style.opacity = '1';
}

/* Posisi visual selalu diturunkan dari slot logika cup. */
function applyPositions(animate, duration = 200) {
  state.layout = computeLayout();
  const { positions } = state.layout;
  state.cups.forEach((cup) => {
    if (!cup.active) return;
    setCupPos(cup, positions[cup.slot], animate ? duration : 0);
  });
}

/* ============================================================
   7. CUP & BOLA
   ============================================================ */
function buildCups() {
  const stage = $('#cup-stage');
  stage.innerHTML = '';
  state.cups = [];

  for (let i = 0; i < CONFIG.TOTAL_CUP; i += 1) {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'cup';
    el.dataset.id = String(i);
    el.innerHTML = `
      <span class="cup-secret" aria-hidden="true"></span>
      <span class="cup-shell" aria-hidden="true">${CUP_SVG}</span>`;
    el.addEventListener('click', () => onCupClick(i));
    stage.append(el);

    state.cups.push({
      id: i,
      slot: i,
      active: true,
      tilt: Math.random() * 5 - 2.5,
      el
    });
  }
}

/* Hanya ada satu bola: state.ballCupId adalah satu-satunya sumber kebenaran. */
function placeBall(excludeId = null) {
  const active = state.cups.filter((cup) => cup.active);
  if (!active.length) return;

  const pool = excludeId === null
    ? active
    : active.filter((cup) => cup.id !== excludeId);
  const candidates = pool.length ? pool : active;
  const chosen = candidates[randInt(0, candidates.length - 1)];

  state.ballCupId = chosen.id;
}

function fillSecret(cup, kind) {
  const secret = cup.el.querySelector('.cup-secret');
  if (!secret) return;
  secret.innerHTML = kind === 'ball'
    ? '<span class="mini-ball"></span>'
    : '<span class="zonk-word">ZONK!</span>';
}

function clearSecret(cup) {
  const secret = cup.el.querySelector('.cup-secret');
  if (secret) secret.innerHTML = '';
}

function updateCupCount() {
  const count = state.cups.filter((cup) => cup.active).length;
  $('#cup-count').textContent = `${count} CUP`;
}

function updateCupLabels() {
  state.cups.forEach((cup, i) => {
    cup.el.setAttribute(
      'aria-label',
      cup.active ? `Cup ${i + 1}, pilih untuk menebak` : `Cup ${i + 1} sudah keluar`
    );
  });
}

/* ============================================================
   8. FASE & STATUS
   ============================================================ */
function setPhase(phase) {
  state.phase = phase;
  const stage = $('#cup-stage');
  if (stage) {
    stage.dataset.phase = phase;
    stage.classList.toggle('is-shuffling', phase === 'shuffling');
  }
}

function setStatus(text) {
  const el = $('#status-text');
  if (el) el.textContent = text;
}

function setTip(text) {
  const el = $('#arena-tip');
  if (el) el.textContent = text;
}

/* ============================================================
   9. HUD
   ============================================================ */
function updateHUD() {
  $('#hud-poin').textContent = state.poin;
  $('#hud-nilai').textContent = state.nilai;
  $('#hud-soal').textContent = `${state.soalIndex}/${CONFIG.TOTAL_SOAL}`;
  $('#hud-bar-fill').style.width = `${(state.soalIndex / CONFIG.TOTAL_SOAL) * 100}%`;
  $('#q-ball').innerHTML = `&#9679; ${state.poin} BOLA`;

  const skipBtn = $('#btn-skip');
  if (skipBtn && state.phase === 'question' && !state.questionResolved) {
    skipBtn.disabled = state.poin < CONFIG.BIAYA_SKIP;
  }
}

/* ============================================================
   10. SHUFFLE CUP
   ============================================================ */
function moveCup(cup, pos, duration) {
  cup.el.style.transition = `transform ${duration}ms cubic-bezier(0.3, 0.7, 0.25, 1)`;
  cup.el.style.transform = cupTransform(cup, pos);
}

async function shuffleCups() {
  const token = state.session;
  // 'transitioning' tetap boleh di-shuffle: restoreCup memanggil fungsi ini
  // tepat setelah cup pengganti masuk.
  if (['result', 'question', 'resolved'].includes(state.phase)) return;

  const active = state.cups.filter((cup) => cup.active);
  if (active.length < 2) return;

  state.busy = false;
  setPhase('shuffling');
  setStatus('Mengacak cup...');
  setTip('Cup sedang diacak. Tunggu sampai berhenti, lalu pilih satu cup.');

  // Pastikan posisi awal tepat sebelum animasi dimulai.
  applyPositions(false);
  await wait(30);
  if (token !== state.session) return;

  const cfg = CONFIG.SHUFFLE[state.speed] || CONFIG.SHUFFLE.cepat;
  const swaps = randInt(cfg.minSwap, cfg.maxSwap);
  let lastA = -1;
  let lastB = -1;

  for (let s = 0; s < swaps; s += 1) {
    if (token !== state.session) return;

    let a;
    let b;
    let guard = 0;
    do {
      a = active[randInt(0, active.length - 1)];
      b = active[randInt(0, active.length - 1)];
      guard += 1;
    } while (
      (a === b ||
        (a.id === lastA && b.id === lastB) ||
        (a.id === lastB && b.id === lastA)) &&
      guard < 60
    );

    const slotA = a.slot;
    const slotB = b.slot;
    a.slot = slotB;
    b.slot = slotA;

    const duration = randInt(cfg.minDur, cfg.maxDur);
    moveCup(a, state.layout.positions[a.slot], duration);
    moveCup(b, state.layout.positions[b.slot], duration);

    lastA = a.id;
    lastB = b.id;
    sfx.tick();

    await wait(duration + 3);
  }

  if (token !== state.session) return;

  await wait(cfg.settle);
  if (token !== state.session) return;

  // Posisi akhir visual = posisi akhir logika.
  applyPositions(true, 170);
  await wait(190);
  if (token !== state.session) return;

  setPhase('choosing');
  setStatus('Pilih satu cup!');
  setTip('Cup sudah berhenti. Tekan cup yang kamu pilih.');
  state.busy = false;
}

/* ============================================================
   11. AKSI PEMAIN
   ============================================================ */
function onCupClick(id) {
  if (state.phase !== 'choosing' || state.busy) return;
  const cup = state.cups.find((item) => item.id === id && item.active);
  if (!cup) return;

  state.busy = true;
  if (cup.id === state.ballCupId) revealBall(cup);
  else revealZonk(cup);
}

async function revealBall(cup) {
  const token = state.session;
  setPhase('revealing');
  setStatus('Membuka cup...');
  cup.el.classList.add('open', 'hit');
  fillSecret(cup, 'ball');
  sfx.click();

  await wait(320);
  if (token !== state.session) return;

  state.poin += CONFIG.POIN_PER_BOLA;
  state.bolaDitemukan += 1;
  updateHUD();

  sfx.success();
  showBanner('HEBAT! KAMU MENEMUKAN BOLA!', 'success');
  confettiBurst(cup.el);
  setStatus('Bola ditemukan! +1 poin bola.');
  setTip('Bola akan disembunyikan lagi. Cup segera diacak ulang.');

  await wait(1350);
  if (token !== state.session) return;

  cup.el.classList.remove('open', 'hit');
  await wait(260);
  if (token !== state.session) return;
  clearSecret(cup);

  // Bola berpindah secara logis ke cup aktif lain (bukan cup yang baru dibuka).
  placeBall(cup.id);
  state.busy = false;
  await shuffleCups();
}

async function revealZonk(cup) {
  const token = state.session;
  setPhase('revealing');
  setStatus('Membuka cup...');
  cup.el.classList.add('open', 'zonk');
  fillSecret(cup, 'zonk');
  sfx.click();

  await wait(300);
  if (token !== state.session) return;

  sfx.zonk();
  shakeArena();
  showBanner('ZONK!', 'zonk');
  setStatus('Cup kosong. Kamu mendapat soal PPKn!');
  setTip('Cup yang kamu pilih keluar dari arena.');

  await wait(950);
  if (token !== state.session) return;

  // Cup keluar dari arena.
  const pos = state.layout.positions[cup.slot];
  cup.el.style.transition = 'transform 0.45s cubic-bezier(0.55, 0, 0.85, 0.36), opacity 0.4s ease';
  cup.el.style.transform = `translate3d(${pos.x}px, ${pos.y + 130}px, 0) scale(0.2) rotate(42deg)`;
  cup.el.style.opacity = '0';
  sfx.whoosh();

  await wait(470);
  if (token !== state.session) return;

  cup.active = false;
  state.removedSlot = cup.slot;
  cup.el.hidden = true;
  cup.el.classList.remove('open', 'zonk');
  cup.el.style.opacity = '';
  cup.el.style.transition = '';
  clearSecret(cup);

  updateCupCount();
  updateCupLabels();
  updateHUD();
  openQuestion();
}

/* ============================================================
   12. PANEL SOAL
   ============================================================ */
function openQuestion() {
  if (state.soalIndex >= CONFIG.TOTAL_SOAL) {
    showResult();
    return;
  }

  const q = state.soalDeck[state.soalIndex];
  state.activeSoal = q;
  state.selectedOption = null;
  state.questionResolved = false;
  setPhase('question');

  $('#q-progress').textContent = `SOAL ${pad2(state.soalIndex + 1)} / ${CONFIG.TOTAL_SOAL}`;
  $('#q-text').textContent = q.pertanyaan;
  updateHUD();

  const wrap = $('#q-options');
  wrap.innerHTML = '';
  q.pilihan.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.dataset.index = String(i);
    btn.setAttribute('aria-pressed', 'false');

    const letter = document.createElement('span');
    letter.className = 'opt-letter';
    letter.textContent = LETTERS[i];

    const label = document.createElement('span');
    label.className = 'opt-text';
    label.textContent = text;

    btn.append(letter, label);
    btn.addEventListener('click', () => selectOption(i));
    wrap.append(btn);
  });

  const feedback = $('#q-feedback');
  feedback.hidden = true;
  feedback.className = 'q-feedback';
  $('#q-fb-title').textContent = '—';
  $('#q-fb-points').textContent = '—';
  $('#q-fb-text').textContent = '—';
  $('#q-fb-key').textContent = '—';

  $('#q-actions').hidden = false;
  const confirm = $('#btn-confirm');
  confirm.disabled = true;
  confirm.textContent = 'KONFIRMASI JAWABAN';

  const skip = $('#btn-skip');
  skip.disabled = state.poin < CONFIG.BIAYA_SKIP;
  skip.title = skip.disabled
    ? 'Butuh minimal 1 poin bola untuk skip.'
    : 'Skip soal: -1 poin bola, +2 nilai.';

  $('#btn-again').hidden = true;
  $('#btn-again').innerHTML = '';

  openOverlay();
  sfx.click();

  setTimeout(() => {
    const first = $('#q-options .option');
    if (first && state.phase === 'question') first.focus({ preventScroll: true });
  }, 120);
}

function openOverlay() {
  const overlay = $('#q-overlay');
  clearTimeout(state.closeTimer);
  overlay.hidden = false;
  document.body.classList.add('modal-open');
  overlay.classList.add('open');
}

function closeQuestion(immediate = false) {
  const overlay = $('#q-overlay');
  if (!overlay) return;
  document.body.classList.remove('modal-open');
  overlay.classList.remove('open');
  clearTimeout(state.closeTimer);
  if (immediate) {
    overlay.hidden = true;
  } else {
    state.closeTimer = setTimeout(() => {
      overlay.hidden = true;
    }, 180);
  }
}

function selectOption(index) {
  if (state.phase !== 'question' || state.questionResolved) return;
  state.selectedOption = index;

  $$('#q-options .option').forEach((btn, i) => {
    const selected = i === index;
    btn.classList.toggle('selected', selected);
    btn.setAttribute('aria-pressed', selected ? 'true' : 'false');
  });

  $('#btn-confirm').disabled = false;
  sfx.click();
}

function confirmAnswer() {
  if (state.phase !== 'question' || state.questionResolved) return;
  if (state.selectedOption === null) return;

  const q = state.activeSoal;
  const correct = state.selectedOption === q.jawaban;

  if (correct) {
    state.benar += 1;
    state.nilai = Math.min(100, state.nilai + CONFIG.NILAI_BENAR);
    sfx.correct();
    showToast(`JAWABAN BENAR! +${CONFIG.NILAI_BENAR} NILAI`);
  } else {
    state.salah += 1;
    sfx.wrong();
  }

  resolveQuestion(correct ? 'correct' : 'wrong');
}

function skipQuestion() {
  if (state.phase !== 'question' || state.questionResolved) return;
  if (state.poin < CONFIG.BIAYA_SKIP) return;

  state.poin -= CONFIG.BIAYA_SKIP;
  state.nilai = Math.min(100, state.nilai + CONFIG.NILAI_SKIP);
  state.skip += 1;

  sfx.skip();
  showToast(`SOAL DILEWATI! +${CONFIG.NILAI_SKIP} NILAI`);
  resolveQuestion('skip');
}

function resolveQuestion(kind) {
  if (state.questionResolved) return;
  state.questionResolved = true;

  const q = state.activeSoal;

  $$('#q-options .option').forEach((btn, i) => {
    btn.disabled = true;
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
    if (i === q.jawaban) btn.classList.add('correct');
    else if (kind !== 'skip' && i === state.selectedOption) btn.classList.add('wrong');
    else btn.classList.add('dim');
  });

  state.soalIndex += 1;

  const feedback = $('#q-feedback');
  feedback.hidden = false;
  feedback.className = `q-feedback ${kind === 'correct' ? 'ok' : kind === 'skip' ? 'skip' : 'miss'}`;

  const title = $('#q-fb-title');
  const points = $('#q-fb-points');

  if (kind === 'correct') {
    title.textContent = 'BENAR!';
    points.textContent = `+${CONFIG.NILAI_BENAR} NILAI`;
  } else if (kind === 'skip') {
    title.textContent = 'SOAL DILEWATI!';
    points.textContent = `+${CONFIG.NILAI_SKIP} NILAI`;
  } else {
    title.textContent = 'SALAH';
    points.textContent = '+0 NILAI';
  }

  $('#q-fb-text').textContent = q.pembahasan;
  $('#q-fb-key').textContent = `Jawaban benar: ${LETTERS[q.jawaban]}. ${q.pilihan[q.jawaban]}`;

  $('#q-actions').hidden = true;

  const again = $('#btn-again');
  again.hidden = false;
  again.innerHTML = state.soalIndex >= CONFIG.TOTAL_SOAL
    ? 'LIHAT HASIL AKHIR <span class="btn-arrow">&rarr;</span>'
    : 'COBA LAGI <span class="btn-arrow">&rarr;</span>';

  setPhase('resolved');
  updateHUD();
  updateCupCount();

  setTimeout(() => {
    if (state.phase === 'resolved') again.focus({ preventScroll: true });
  }, 90);
}

/* ============================================================
   13. COBA LAGI & CUP PENGGANTI
   ============================================================ */
function onAgain() {
  if (state.phase !== 'resolved') return;

  if (state.soalIndex >= CONFIG.TOTAL_SOAL) {
    showResult();
    return;
  }

  closeQuestion();
  restoreCup();
}

async function restoreCup() {
  const token = state.session;
  setPhase('transitioning');
  state.busy = true;

  const slot = state.removedSlot;
  const cup = state.cups.find((item) => !item.active && item.slot === slot)
    || state.cups.find((item) => !item.active);

  if (!cup) {
    state.busy = false;
    await shuffleCups();
    return;
  }

  cup.active = true;
  if (slot !== null) cup.slot = slot;
  state.removedSlot = null;

  const layout = computeLayout();
  state.layout = layout;
  const pos = layout.positions[cup.slot];

  const fromLeft = Math.random() < 0.5;
  const offset = layout.cupW + 190;

  cup.el.hidden = false;
  cup.el.className = 'cup entering';
  cup.el.style.transition = 'none';
  cup.el.style.opacity = '0';
  cup.el.style.transform = `translate3d(${pos.x + (fromLeft ? -offset : offset)}px, ${pos.y}px, 0) scale(0.55) rotate(${fromLeft ? -26 : 26}deg)`;
  void cup.el.offsetWidth;

  cup.el.style.transition = 'transform 0.52s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.35s ease';
  cup.el.style.transform = cupTransform(cup, pos);
  cup.el.style.opacity = '1';

  updateCupCount();
  updateCupLabels();
  setStatus('Cup pengganti masuk...');
  setTip('Satu cup kosong masuk kembali. Cup akan diacak ulang.');
  sfx.whoosh();

  await wait(540);
  if (token !== state.session) return;

  cup.el.classList.remove('entering');

  // Validasi: bola harus tetap berada di salah satu cup yang tersisa.
  const ballCup = state.cups.find((item) => item.id === state.ballCupId);
  if (!ballCup || !ballCup.active || ballCup.id === cup.id) {
    placeBall(cup.id);
  }

  state.busy = false;
  await shuffleCups();
}

/* ============================================================
   14. HASIL AKHIR
   ============================================================ */
function showResult() {
  state.session += 1; // batalkan proses async yang masih berjalan
  state.phase = 'result';
  closeQuestion(true);
  hideBanner();
  hideToast();

  const answered = state.benar + state.salah;
  const accuracy = answered ? Math.round((state.benar / answered) * 100) : 0;

  $('#result-nilai').textContent = state.nilai;
  $('#result-sub').textContent =
    `${state.benar} benar · ${state.salah} salah · ${state.skip} skip · ${state.bolaDitemukan} bola ditemukan`;

  $('#result-benar').textContent = state.benar;
  $('#result-salah').textContent = state.salah;
  $('#result-skip').textContent = state.skip;
  $('#result-bola').textContent = state.bolaDitemukan;
  $('#result-poin').textContent = state.poin;
  $('#result-akurasi').textContent = `${accuracy}%`;

  const bar = $('#result-bar');
  bar.style.width = '0%';
  requestAnimationFrame(() => {
    bar.style.width = `${Math.max(0, Math.min(100, state.nilai))}%`;
  });

  const predikat = $('#result-predikat');
  let label = 'TERUS BERLATIH';
  let cls = 'bad';
  if (state.nilai >= 90) {
    label = 'LUAR BIASA';
    cls = 'top';
  } else if (state.nilai >= 70) {
    label = 'HEBAT';
    cls = 'good';
  } else if (state.nilai >= 50) {
    label = 'CUKUP';
    cls = '';
  }
  predikat.textContent = label;
  predikat.className = `score-predikat ${cls}`.trim();

  setPhase('result');
  showScreen('result');
  sfx.fanfare();
}

/* ============================================================
   15. NAVIGASI & PERSIAPAN
   ============================================================ */
function showScreen(name) {
  state.screen = name;
  $$('.screen').forEach((screen) => {
    screen.classList.toggle('active', screen.id === `screen-${name}`);
  });
  const restart = $('#btn-restart');
  if (restart) restart.hidden = name !== 'game';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startGame() {
  ensureAudio();

  state.session += 1;
  const token = state.session;

  state.poin = 0;
  state.nilai = 0;
  state.benar = 0;
  state.salah = 0;
  state.skip = 0;
  state.bolaDitemukan = 0;

  state.soalDeck = shuffleArray(BANK_SOAL);
  state.soalIndex = 0;
  state.activeSoal = null;
  state.selectedOption = null;
  state.questionResolved = false;

  state.cups = [];
  state.layout = null;
  state.ballCupId = null;
  state.removedSlot = null;
  state.busy = false;

  hideBanner();
  hideToast();
  closeQuestion(true);
  setPhase('idle');

  showScreen('game');
  buildCups();
  placeBall();
  updateCupCount();
  updateCupLabels();
  updateHUD();
  setStatus('Bersiap...');
  setTip('Cup akan diacak. Perhatikan baik-baik!');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (token !== state.session) return;
      applyPositions(false);
      wait(300).then(() => {
        if (token === state.session) shuffleCups();
      });
    });
  });
}

function resetToStart() {
  state.session += 1;
  state.phase = 'idle';
  hideBanner();
  hideToast();
  closeQuestion(true);
  showScreen('start');
}

/* ============================================================
   16. BANNER, TOAST, CONFETTI, SHAKE
   ============================================================ */
function showBanner(text, type) {
  const banner = $('#banner');
  clearTimeout(state.bannerTimer);
  banner.textContent = text;
  banner.className = `banner ${type}`;
  banner.hidden = false;
  void banner.offsetWidth;
  banner.classList.add('show');

  state.bannerTimer = setTimeout(() => {
    banner.classList.remove('show');
    state.bannerTimer = setTimeout(() => {
      banner.hidden = true;
    }, 280);
  }, 1500);
}

function hideBanner() {
  const banner = $('#banner');
  clearTimeout(state.bannerTimer);
  banner.classList.remove('show');
  banner.hidden = true;
}

function showToast(text) {
  const toast = $('#toast');
  clearTimeout(state.toastTimer);
  toast.textContent = text;
  toast.hidden = false;
  void toast.offsetWidth;
  toast.classList.add('show');

  state.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    state.toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 220);
  }, 1700);
}

function hideToast() {
  const toast = $('#toast');
  clearTimeout(state.toastTimer);
  toast.classList.remove('show');
  toast.hidden = true;
}

function confettiBurst(sourceEl) {
  if (REDUCED.matches) return;

  const layer = $('#fx');
  const rect = sourceEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#ffc93c', '#4c8dff', '#36d98b', '#ff4d6d', '#8b5cf6', '#37e0ff'];

  for (let i = 0; i < 26; i += 1) {
    const piece = document.createElement('i');
    piece.className = 'confetti';
    piece.style.left = `${cx}px`;
    piece.style.top = `${cy}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty('--dx', `${Math.round(Math.random() * 380 - 190)}px`);
    piece.style.setProperty('--dy', `${Math.round(Math.random() * -240 - 30)}px`);
    piece.style.setProperty('--rot', `${Math.round(Math.random() * 720 - 360)}deg`);
    piece.style.animationDelay = `${(Math.random() * 0.08).toFixed(2)}s`;
    layer.append(piece);
    setTimeout(() => piece.remove(), 1600);
  }
}

function shakeArena() {
  if (REDUCED.matches) return;
  const arena = $('#screen-game');
  arena.classList.remove('shake');
  void arena.offsetWidth;
  arena.classList.add('shake');
  setTimeout(() => arena.classList.remove('shake'), 500);
}

/* ============================================================
   17. VALIDASI BANK SOAL
   ============================================================ */
function validateBank() {
  if (!Array.isArray(BANK_SOAL) || BANK_SOAL.length < CONFIG.TOTAL_SOAL) {
    console.error('[ZONK] Bank soal tidak cukup. Dibutuhkan minimal', CONFIG.TOTAL_SOAL, 'soal.');
    return;
  }
  BANK_SOAL.forEach((q) => {
    if (
      !q ||
      typeof q.pertanyaan !== 'string' ||
      !Array.isArray(q.pilihan) ||
      q.pilihan.length !== 4 ||
      !Number.isInteger(q.jawaban) ||
      q.jawaban < 0 ||
      q.jawaban > 3
    ) {
      console.error('[ZONK] Soal tidak valid:', q && q.id);
    }
  });
}

/* ============================================================
   18. EVENT & INISIALISASI
   ============================================================ */
function init() {
  loadPrefs();
  validateBank();

  setSpeed(state.speed);
  setMuted(state.muted);

  $('#btn-start').addEventListener('click', () => {
    sfx.click();
    startGame();
  });

  $('#btn-replay').addEventListener('click', () => {
    sfx.click();
    startGame();
  });

  $('#btn-home').addEventListener('click', () => {
    sfx.click();
    resetToStart();
  });

  $('#brand-home').addEventListener('click', (event) => {
    event.preventDefault();
    if (state.screen === 'game') {
      const ok = window.confirm('Keluar ke halaman pembuka? Progres sesi ini akan hilang.');
      if (!ok) return;
    }
    resetToStart();
  });

  // MULAI ULANG: reset penuh, berbeda dari COBA LAGI yang hanya melanjutkan sesi.
  $('#btn-restart').addEventListener('click', () => {
    if (state.screen !== 'game') return;
    const ok = window.confirm('Mulai ulang permainan? Semua poin, nilai, dan progres sesi ini akan dihapus.');
    if (!ok) return;
    sfx.click();
    startGame();
  });

  $$('.speed-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      setSpeed(btn.dataset.speed);
      sfx.click();
    });
  });

  $('#btn-mute').addEventListener('click', () => {
    setMuted(!state.muted);
    if (!state.muted) sfx.click();
  });

  $('#btn-confirm').addEventListener('click', () => {
    if (!$('#btn-confirm').disabled) sfx.click();
    confirmAnswer();
  });

  $('#btn-skip').addEventListener('click', () => {
    if (!$('#btn-skip').disabled) sfx.click();
    skipQuestion();
  });

  $('#btn-again').addEventListener('click', () => {
    sfx.click();
    onAgain();
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (state.screen !== 'game' || !state.cups.length) return;
      if (state.phase === 'shuffling') return; // posisi dirapikan di akhir shuffle
      applyPositions(false);
    }, 140);
  });
}

document.addEventListener('DOMContentLoaded', init);

/* Ekspos untuk pengujian otomatis (tidak memengaruhi permainan). */
window.__ZONK = { state, CONFIG };
