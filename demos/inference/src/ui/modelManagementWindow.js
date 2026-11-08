/** Reuse library/configuration controls inside one dialog without owning models. */
export function createModelManagementWindow({ browser, onRequestClose }) {
  const pages = new Map();
  let current, closing, refreshOnReturn = false;
  function showLibrary() {
    current = null; browser.showLibrary({ refreshStored: refreshOnReturn }); refreshOnReturn = false;
  }
  function requestClose() {
    if (closing) return closing;
    browser.setFeedback('Closing Models… Waiting for cleanup.');
    closing = Promise.resolve().then(onRequestClose).catch((error) => {
      showLibrary();
      browser.setFeedback(`Could not close Models: ${error.message}. Click Done to retry.`);
      throw error;
    }).finally(() => { closing = null; });
    return closing;
  }
  return {
    requestClose, showLibrary,
    isShowing: (modal) => current === modal,
    show(modal, { closeWindow = false, refreshStoredOnReturn = false } = {}) {
      let content = pages.get(modal);
      if (!content) {
        content = document.createElement('section'); content.className = 'pc-management-content';
        // Keep the existing control/event instances; only replace modal chrome.
        for (const child of [...modal.children]) if (!child.classList.contains('pc-dialog-header')) content.append(child);
        pages.set(modal, content);
      }
      current = modal;
      refreshOnReturn = refreshStoredOnReturn;
      browser.showPage({ title: modal.querySelector('h2')?.textContent ?? 'Models', content,
        buttonLabel: closeWindow ? 'Close Models' : 'Done', onBack: closeWindow ? requestClose : showLibrary });
    },
  };
}
