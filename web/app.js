import CaseEngine, { CYCLE, apply } from './case-engine.js';

const els = {
  text: document.getElementById('text'),
  status: document.getElementById('status'),
  buttons: document.getElementById('buttons'),
  copy: document.getElementById('copy'),
  paste: document.getElementById('paste'),
  clear: document.getElementById('clear'),
  share: document.getElementById('share'),
  install: document.getElementById('install'),
  charCount: document.getElementById('charCount'),
  wordCount: document.getElementById('wordCount'),
};

let state = 0; // index into CYCLE

const LABELS = {
  invert: 'iNVERT cASE',
  lower: 'lower case',
  upper: 'UPPER CASE',
  title: 'Title Case',
  sentence: 'Sentence case',
};

function setStatus(msg, kind = 'info') {
  els.status.textContent = msg;
  els.status.dataset.kind = kind;
  if (kind !== 'persist') {
    clearTimeout(setStatus._t);
    setStatus._t = setTimeout(() => {
      els.status.textContent = '';
      els.status.dataset.kind = '';
    }, 2200);
  }
}

function updateCounts() {
  const t = els.text.value;
  els.charCount.textContent = `${t.length} char${t.length === 1 ? '' : 's'}`;
  const words = t.trim() ? t.trim().split(/\s+/).length : 0;
  els.wordCount.textContent = `${words} word${words === 1 ? '' : 's'}`;
}

function transformSelectionOrAll(name) {
  const t = els.text;
  const start = t.selectionStart;
  const end = t.selectionEnd;
  const hasSelection = start !== end;
  if (hasSelection) {
    const before = t.value.slice(0, start);
    const middle = t.value.slice(start, end);
    const after = t.value.slice(end);
    const replaced = apply(name, middle);
    t.value = before + replaced + after;
    t.setSelectionRange(start, start + replaced.length);
  } else {
    t.value = apply(name, t.value);
  }
  setStatus(`→ ${LABELS[name]}`);
  updateCounts();
}

function cycleNext() {
  const name = CYCLE[state];
  transformSelectionOrAll(name);
  state = (state + 1) % CYCLE.length;
}

// Wire transform buttons.
for (const btn of els.buttons.querySelectorAll('button[data-transform]')) {
  btn.addEventListener('click', () => {
    const name = btn.dataset.transform;
    transformSelectionOrAll(name);
    state = (CYCLE.indexOf(name) + 1) % CYCLE.length;
  });
}

// Shift+F3 in textarea cycles like the original AHK.
els.text.addEventListener('keydown', (e) => {
  if (e.key === 'F3' && e.shiftKey) {
    e.preventDefault();
    cycleNext();
  }
});

// Global Shift+F3 also cycles, even when the textarea isn't focused.
window.addEventListener('keydown', (e) => {
  if (e.key === 'F3' && e.shiftKey && document.activeElement !== els.text) {
    e.preventDefault();
    els.text.focus();
    cycleNext();
  }
});

els.text.addEventListener('input', updateCounts);

els.copy.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(els.text.value);
    setStatus('Copied to clipboard');
  } catch {
    els.text.select();
    document.execCommand?.('copy');
    setStatus('Copied');
  }
});

els.paste.addEventListener('click', async () => {
  try {
    const v = await navigator.clipboard.readText();
    els.text.value = v;
    setStatus('Pasted from clipboard');
    updateCounts();
  } catch {
    setStatus('Paste blocked — paste manually with Ctrl/Cmd+V', 'warn');
  }
});

els.clear.addEventListener('click', () => {
  els.text.value = '';
  state = 0;
  updateCounts();
  els.text.focus();
});

els.share.addEventListener('click', async () => {
  const text = els.text.value;
  if (!text) { setStatus('Nothing to share', 'warn'); return; }
  if (navigator.share) {
    try { await navigator.share({ text, title: 'Shift+F3 Case Changer' }); }
    catch {}
  } else {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Share API unavailable — copied instead');
    } catch {
      setStatus('Share unavailable', 'warn');
    }
  }
});

// PWA install prompt.
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e;
  els.install.hidden = false;
});
els.install.addEventListener('click', async () => {
  if (!deferredInstall) return;
  deferredInstall.prompt();
  await deferredInstall.userChoice;
  deferredInstall = null;
  els.install.hidden = true;
});

// Receive shared text via Web Share Target.
const params = new URLSearchParams(location.search);
const shared = params.get('text') || params.get('title');
if (shared) { els.text.value = shared; updateCounts(); }

// Service worker registration.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

updateCounts();
els.text.focus();
