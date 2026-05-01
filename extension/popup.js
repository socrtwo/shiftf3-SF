document.querySelectorAll('button[data-do]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const transform = btn.dataset.do;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) return;
    try {
      await chrome.tabs.sendMessage(tab.id, { type: 'shiftf3:cycle', transform });
    } catch {
      // Restricted page — silently ignore.
    }
    window.close();
  });
});
