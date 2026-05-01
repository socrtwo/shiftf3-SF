// Shift+F3 Case Engine — shared transform logic.
// Mirrors the original AutoHotkey behavior:
//   state 0: invert  → 1: lower → 2: UPPER → 3: Title → 4: Sentence → 0
// Exposed as ESM and as window.CaseEngine for non-module consumers.

const CYCLE = ['invert', 'lower', 'upper', 'title', 'sentence'];

const SMALL_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in',
  'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'via'
]);

const KEEP_VERBATIM = ['I', 'AHK', 'AutoHotkey'];

function invert(s) {
  let out = '';
  for (const ch of s) {
    const lower = ch.toLowerCase();
    const upper = ch.toUpperCase();
    if (ch === lower && ch !== upper) out += upper;
    else if (ch === upper && ch !== lower) out += lower;
    else out += ch;
  }
  return out;
}

function lower(s) { return s.toLowerCase(); }
function upper(s) { return s.toUpperCase(); }

function title(s) {
  // Word-style title case: capitalize each "word", but lowercase the
  // small connecting words unless they start the string or follow a
  // sentence terminator.
  return s.replace(/(\S+)/g, (word, _m, offset, full) => {
    const lc = word.toLowerCase();
    const stripped = lc.replace(/[^a-z']/gi, '');
    const atStart = offset === 0 || /[\.\!\?]\s*$/.test(full.slice(0, offset));
    if (!atStart && SMALL_WORDS.has(stripped)) return lc;
    return lc.replace(/[a-zà-ÿ]/, c => c.toUpperCase());
  }).replace(/\b([a-z]+)\b/gi, (m) => {
    for (const k of KEEP_VERBATIM) {
      if (m.toLowerCase() === k.toLowerCase()) return k;
    }
    return m;
  });
}

function sentence(s) {
  // Lowercase everything, then capitalize the first letter of every
  // sentence (after . ! ? or at the start / after a newline).
  const lc = s.toLowerCase();
  return lc.replace(
    /(^|[\.\!\?]\s+|[\r\n]+)(\S)/g,
    (_m, lead, ch) => lead + ch.toUpperCase()
  );
}

const TRANSFORMS = { invert, lower, upper, title, sentence };

function apply(name, text) {
  const fn = TRANSFORMS[name];
  if (!fn) throw new Error(`Unknown transform: ${name}`);
  return fn(text);
}

function nextStateFor(text, state) {
  // Returns { text, name, state } for the next step in the cycle.
  const name = CYCLE[state];
  return { text: apply(name, text), name, state: (state + 1) % CYCLE.length };
}

const CaseEngine = { CYCLE, apply, invert, lower, upper, title, sentence, nextStateFor };

if (typeof window !== 'undefined') window.CaseEngine = CaseEngine;
if (typeof module !== 'undefined' && module.exports) module.exports = CaseEngine;
export default CaseEngine;
export { CYCLE, apply, invert, lower, upper, title, sentence, nextStateFor };
