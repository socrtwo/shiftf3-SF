// Shift+F3 Case Changer — in-page content script.
// Listens for Shift+F3 inside text inputs, textareas, and contentEditable
// regions, and cycles the selected text through five cases. State is
// kept per-frame so successive presses advance the cycle.
(() => {
  const { CYCLE, apply } = self.CaseEngine;
  let state = 0;

  const isEditableElement = (el) => {
    if (!el) return false;
    if (el.isContentEditable) return true;
    const tag = el.tagName;
    if (tag === 'TEXTAREA') return true;
    if (tag === 'INPUT') {
      const t = (el.type || 'text').toLowerCase();
      return ['text', 'search', 'url', 'tel', 'email', 'password', ''].includes(t);
    }
    return false;
  };

  function transformInputLike(el) {
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? el.value.length;
    const hasSelection = start !== end;
    const target = hasSelection ? el.value.slice(start, end) : el.value;
    const replaced = apply(CYCLE[state], target);

    if (hasSelection) {
      el.setRangeText(replaced, start, end, 'preserve');
      el.setSelectionRange(start, start + replaced.length);
    } else {
      // No selection — replace whole field, keep caret near end.
      const caret = Math.min(end, replaced.length);
      el.value = replaced;
      try { el.setSelectionRange(caret, caret); } catch {}
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function transformContentEditable(root) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const collapsed = range.collapsed;

    let text;
    if (collapsed) {
      // No selection — fall back to all text inside the element.
      text = root.innerText;
      const replaced = apply(CYCLE[state], text);
      root.innerText = replaced;
    } else {
      text = sel.toString();
      const replaced = apply(CYCLE[state], text);
      range.deleteContents();
      const node = document.createTextNode(replaced);
      range.insertNode(node);
      // Restore selection over inserted text.
      const newRange = document.createRange();
      newRange.setStart(node, 0);
      newRange.setEnd(node, replaced.length);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
    root.dispatchEvent(new InputEvent('input', { bubbles: true }));
  }

  function findEditableContext(target) {
    let el = target;
    while (el && el !== document.body) {
      if (el.isContentEditable) return { kind: 'ce', el };
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        if (isEditableElement(el)) return { kind: 'input', el };
      }
      el = el.parentElement;
    }
    if (target && isEditableElement(target)) return { kind: 'input', el: target };
    return null;
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'F3' || !e.shiftKey) return;
    const ctx = findEditableContext(e.target);
    if (!ctx) return;
    e.preventDefault();
    e.stopPropagation();
    if (ctx.kind === 'input') transformInputLike(ctx.el);
    else transformContentEditable(ctx.el);
    state = (state + 1) % CYCLE.length;
  }, true);

  // Allow the popup / background to trigger the same flow on the active frame.
  if (typeof chrome !== 'undefined' && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
      if (msg?.type !== 'shiftf3:cycle') return;
      const target = document.activeElement;
      const ctx = findEditableContext(target);
      if (!ctx) { sendResponse({ ok: false, reason: 'no-editable' }); return true; }
      if (ctx.kind === 'input') transformInputLike(ctx.el);
      else transformContentEditable(ctx.el);
      state = (state + 1) % CYCLE.length;
      sendResponse({ ok: true, applied: CYCLE[(state + CYCLE.length - 1) % CYCLE.length] });
      return true;
    });
  }
})();
