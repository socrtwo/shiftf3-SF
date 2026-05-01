// Shift+F3 case engine — content-script copy (no ES module syntax).
// Mirror of /web/case-engine.js so changes there should be reflected here.
(function (root) {
  const CYCLE = ['invert', 'lower', 'upper', 'title', 'sentence'];

  const SMALL_WORDS = new Set([
    'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in',
    'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet', 'via'
  ]);
  const KEEP_VERBATIM = ['I', 'AHK', 'AutoHotkey'];

  function invert(s) {
    let out = '';
    for (const ch of s) {
      const lo = ch.toLowerCase();
      const up = ch.toUpperCase();
      if (ch === lo && ch !== up) out += up;
      else if (ch === up && ch !== lo) out += lo;
      else out += ch;
    }
    return out;
  }
  function lower(s) { return s.toLowerCase(); }
  function upper(s) { return s.toUpperCase(); }
  function title(s) {
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
    return s.toLowerCase().replace(
      /(^|[\.\!\?]\s+|[\r\n]+)(\S)/g,
      (_m, lead, ch) => lead + ch.toUpperCase()
    );
  }
  const TRANSFORMS = { invert, lower, upper, title, sentence };
  function apply(name, t) { return TRANSFORMS[name](t); }
  function nextStateFor(t, state) {
    const name = CYCLE[state];
    return { text: apply(name, t), name, state: (state + 1) % CYCLE.length };
  }

  root.CaseEngine = { CYCLE, apply, invert, lower, upper, title, sentence, nextStateFor };
})(typeof self !== 'undefined' ? self : this);
