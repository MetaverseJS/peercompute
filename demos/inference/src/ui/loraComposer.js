const node = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
};
const button = (text) => { const element = node('button', text); element.type = 'button'; return element; };
const bytesLabel = (size) => `${(size / 1024 ** 2).toFixed(1)} MiB`;

/** One reusable adapter dialog. Acquisition, runtime selection and loading remain
 * owned by the caller; closing cancels only this dialog's current operation. */
export function createLoraComposer({ container, onInspect, onApply, onClose } = {}) {
  if (!container?.append || typeof onInspect !== 'function' || typeof onApply !== 'function') {
    throw new TypeError('LoRA composer requires a container, inspection and apply handlers.');
  }
  const element = node('dialog', undefined, 'pc-model-dialog pc-lora-composer');
  const title = node('h2', 'Add LoRA'); title.id = `lora-composer-${crypto.randomUUID()}`;
  element.setAttribute('aria-labelledby', title.id);
  const header = node('div', undefined, 'pc-dialog-header'), done = button('Done');
  header.append(title, done);
  const body = node('div', undefined, 'pc-dialog-body');
  const baseLabel = node('p'); baseLabel.style.overflowWrap = 'anywhere';
  const help = node('p', 'Add a GGUF LoRA to this GGUF model. Safetensors and ONNX adapters are not supported here.');
  const form = node('form'), source = node('input');
  source.type = 'text'; source.maxLength = 1024; source.placeholder = 'huggingface.co/owner/adapter or a GGUF file URL';
  source.autocomplete = 'off'; source.spellcheck = false;
  const sourceLabel = node('label', 'Hugging Face adapter'); sourceLabel.append(source);
  const inspect = node('button', 'Inspect'); inspect.type = 'submit';
  form.append(sourceLabel, inspect);
  const selection = node('fieldset'); selection.hidden = true;
  const selectLabel = node('div'), variants = node('div');
  const variantsTitle = node('p', 'Adapter file'); variantsTitle.id = `${title.id}-files`;
  variants.setAttribute('role', 'group'); variants.setAttribute('aria-labelledby', variantsTitle.id);
  selectLabel.append(variantsTitle, variants);
  const detail = node('p'); detail.style.overflowWrap = 'anywhere';
  const notice = node('p', 'Tensor compatibility is checked before download. The publisher may not specify the training base revision.');
  const strength = node('input'); strength.type = 'number'; strength.min = '-2'; strength.max = '2'; strength.step = '0.1'; strength.value = '1';
  const strengthLabel = node('label', 'Strength'); strengthLabel.append(strength);
  const modelName = node('input'); modelName.type = 'text'; modelName.maxLength = 256;
  const nameLabel = node('label', 'Model name'); nameLabel.append(modelName);
  const load = node('input'); load.type = 'checkbox'; load.checked = true;
  const loadLabel = node('label'); loadLabel.append(load, document.createTextNode(' Load after saving'));
  const loadHelp = node('p', 'Loading this version unloads the selected model first. Its downloaded files stay stored.');
  const apply = button('Save and load');
  selection.append(selectLabel, detail, notice, strengthLabel, nameLabel, loadLabel, loadHelp, apply);
  const status = node('p', '', 'pc-inference-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  body.append(baseLabel, help, form, selection); element.append(header, body, status); container.append(element);
  // Inherit the same retro dialog controls while keeping the form narrow on phones.
  for (const label of [sourceLabel, selectLabel, strengthLabel, nameLabel]) {
    Object.assign(label.style, { display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' });
  }
  Object.assign(form.style, { marginBottom: '1rem' });
  Object.assign(selection.style, { border: '0', padding: '0', minWidth: '0' });
  for (const input of [source, variants, modelName]) Object.assign(input.style, { width: '100%', minWidth: '0', boxSizing: 'border-box' });

  let current, candidates = [], controller, sequence = 0, selectedIndex = 0, busy = false, disposed = false, opener;
  const errorText = (error) => String(error?.message ?? error ?? 'Request failed').slice(0, 500);
  const selected = () => candidates[selectedIndex];
  const validStrength = () => strength.value.trim() !== '' && Number.isFinite(Number(strength.value))
    && Math.abs(Number(strength.value)) <= 2;
  function render() {
    source.disabled = busy; inspect.disabled = busy || !source.value.trim();
    for (const radio of variants.querySelectorAll('input')) radio.disabled = busy;
    strength.disabled = modelName.disabled = load.disabled = busy;
    apply.disabled = busy || !selected() || !validStrength() || !modelName.value.trim();
    apply.textContent = load.checked ? 'Save and load' : 'Save model';
    done.textContent = busy ? 'Cancel' : 'Done';
    loadHelp.hidden = !load.checked;
  }
  function selectVariant() {
    const value = selected();
    detail.textContent = value ? `${value.profile?.architecture ?? 'GGUF'} · ${bytesLabel(value.file.size)}` : '';
    if (value) modelName.value = `${current?.name ?? 'Model'} + ${value.name}`.slice(0, 256);
    render();
  }
  function stop() {
    sequence += 1;
    controller?.abort(new DOMException('Adapter operation cancelled', 'AbortError'));
    controller = undefined; busy = false;
  }
  function closed() {
    const hadCurrent = !!current;
    stop(); current = undefined; candidates = [];
    if (!disposed) {
      opener?.isConnected && opener.focus();
      if (hadCurrent) onClose?.();
    }
  }
  function close() {
    if (element.open) element.close();
    // Native close events are queued. Invalidate callbacks immediately.
    closed();
  }
  async function operation(handler) {
    stop(); controller = new AbortController();
    const token = sequence, active = controller;
    const alive = () => !disposed && !!current && token === sequence && !active.signal.aborted;
    busy = true; status.textContent = ''; render();
    try { await handler(active.signal, alive); }
    catch (error) { if (alive()) status.textContent = errorText(error); }
    finally { if (alive()) { controller = undefined; busy = false; render(); } }
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (busy || !current || !source.value.trim()) return;
    candidates = []; variants.replaceChildren(); selection.hidden = true;
    void operation(async (signal, alive) => {
      status.textContent = 'Inspecting adapter files…';
      const result = await onInspect(source.value.trim(), { signal });
      if (!alive()) return;
      if (!Array.isArray(result?.variants) || !result.variants.length) throw new Error('No compatible GGUF LoRA files found.');
      candidates = result.variants;
      selectedIndex = 0;
      variants.replaceChildren(...candidates.map((item, index) => {
        const choice = node('label'), radio = node('input');
        radio.type = 'radio'; radio.name = `${title.id}-variant`; radio.value = String(index); radio.checked = index === 0;
        const caption = node('span', `${item.name} · ${bytesLabel(item.file.size)}`);
        Object.assign(choice.style, { display: 'flex', alignItems: 'start', gap: '0.5rem', marginBottom: '0.5rem' });
        Object.assign(caption.style, { minWidth: '0', overflowWrap: 'anywhere' });
        choice.append(radio, caption); return choice;
      }));
      selection.hidden = false; selectVariant();
      status.textContent = result.warning ?? `${candidates.length} adapter file${candidates.length === 1 ? '' : 's'} found.`;
    });
  });
  apply.addEventListener('click', () => {
    if (busy || !current || !selected() || !validStrength() || !modelName.value.trim()) return;
    const request = { baseManifestCid: current.manifestCid, adapter: selected(), scale: Number(strength.value),
      name: modelName.value.trim(), load: load.checked };
    void operation(async (signal, alive) => {
      status.textContent = 'Checking adapter compatibility…';
      await onApply({ ...request, signal, onProgress(event) {
        if (!alive()) return;
        status.textContent = event.stage === 'import' && Number.isFinite(event.totalBytes)
          ? `Saving adapter: ${bytesLabel(event.loaded ?? 0)} / ${bytesLabel(event.totalBytes)}`
          : event.stage === 'verify' ? 'Verifying adapter…'
            : event.stage === 'load' ? 'Loading model…' : 'Checking adapter compatibility…';
      } });
      if (!alive()) return;
      close();
    });
  });
  source.addEventListener('input', () => {
    candidates = []; variants.replaceChildren(); selection.hidden = true; status.textContent = ''; render();
  });
  variants.addEventListener('change', (event) => {
    if (event.target?.type === 'radio' && event.target.checked) { selectedIndex = Number(event.target.value); selectVariant(); }
  });
  for (const input of [strength, modelName, load]) input.addEventListener('input', render);
  done.addEventListener('click', close);
  element.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  element.addEventListener('close', () => { if (!element.open) closed(); });
  element.addEventListener('keydown', (event) => event.stopPropagation());

  return {
    element,
    open({ manifestCid, name = 'Model' } = {}) {
      if (disposed) throw new Error('LoRA composer is disposed.');
      if (typeof manifestCid !== 'string' || !manifestCid) throw new Error('Select one stored GGUF model first.');
      stop(); opener = document.activeElement;
      current = { manifestCid, name: String(name).slice(0, 256) };
      baseLabel.textContent = `Base model: ${current.name}`;
      candidates = []; source.value = ''; variants.replaceChildren(); selection.hidden = true;
      strength.value = '1'; load.checked = true; status.textContent = ''; modelName.value = ''; render();
      if (!element.open) element.showModal();
      source.focus();
    },
    close,
    dispose() { if (disposed) return; disposed = true; close(); element.remove(); },
  };
}
