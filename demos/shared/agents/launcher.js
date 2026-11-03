/** Lazily open the shared model panel; normal demo startup allocates no model. */
export function installDemoAgentLauncher({ getOptions, beforeOpen } = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = '> LOCAL AGENT';
  button.style.cssText = 'position:fixed;right:12px;bottom:12px;z-index:10000;background:#071716;color:#8fffd4;border:1px solid #58bba0;padding:10px;font:13px monospace;cursor:pointer';
  document.body.append(button);
  let panel = null, shell = null, opening = null, disposed = false;
  const close = async () => {
    if (opening) await opening;
    await panel?.dispose();
    panel = null;
    shell?.remove();
    shell = null;
    button.disabled = false;
  };
  button.addEventListener('click', () => {
    if (panel || opening || disposed) return;
    button.disabled = true;
    opening = (async () => {
      try {
        beforeOpen?.();
        const { mountInferencePanel } = await import('../../inference/src/agentPanel.js');
        if (disposed) return;
        shell = document.createElement('section');
        shell.setAttribute('aria-label', 'Local model agent');
        shell.style.cssText = 'position:fixed;right:12px;bottom:58px;z-index:10001;width:min(620px,calc(100vw - 24px));max-height:80vh;overflow:auto;background:#071716;border:1px solid #58bba0;color:#baffdf;padding:12px;box-sizing:border-box';
        const closeButton = document.createElement('button');
        closeButton.type = 'button'; closeButton.textContent = 'CLOSE / UNLOAD';
        closeButton.addEventListener('click', () => {
          closeButton.disabled = true;
          void close().catch((error) => { closeButton.disabled = false; closeButton.textContent = `RETRY CLOSE: ${error.message}`; });
        });
        const content = document.createElement('div');
        shell.append(closeButton, content); document.body.append(shell);
        panel = await mountInferencePanel({ ...(await getOptions()), container: content,
          onClose() { panel = null; shell?.remove(); shell = null; button.disabled = false; }
        });
        if (disposed) { await panel.dispose(); panel = null; shell?.remove(); shell = null; }
      } catch (error) {
        shell?.remove(); shell = null;
        button.textContent = `AGENT UNAVAILABLE: ${error.message}`;
        button.disabled = false;
      } finally { opening = null; }
    })();
  });
  return { async dispose() { disposed = true; await close(); button.remove(); } };
}
