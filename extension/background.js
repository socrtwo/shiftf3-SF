// MV3 service worker. Forwards the Shift+F3 chrome command to the
// active tab's content script so it works even on pages that capture
// the keystroke before the page handler can run.
chrome.commands?.onCommand.addListener(async (command) => {
  if (command !== 'cycle-case') return;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    await chrome.tabs.sendMessage(tab.id, { type: 'shiftf3:cycle' });
  } catch {
    // Some pages (e.g. chrome://, store pages) don't host content scripts.
  }
});
