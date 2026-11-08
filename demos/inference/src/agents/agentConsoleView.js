let sequence = 0;
export function buildAgentConsoleView(container) {
  const node = (tag, text, className) => { const el = document.createElement(tag); if (text) el.textContent = text; if (className) el.className = className; return el; };
  const button = (text) => { const el = node('button', text); el.type = 'button'; return el; };
  const field = (text, input) => { const label = node('label', text); label.append(input); return label; };
  const input = (tag, name, limit) => { const el = node(tag); el.setAttribute('aria-label', name); if (limit) el.maxLength = limit; return el; };
  const element = node('dialog', null, 'pc-agent-console');
  const heading = node('h2', 'Agents'); heading.id = `pc-agents-${++sequence}`; element.setAttribute('aria-labelledby', heading.id);
  const close = button('Done'); const header = node('header'); header.append(heading, close);
  const status = node('p', '', 'pc-agent-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const body = node('div', null, 'pc-agent-body');
  const main = node('div', null, 'pc-agent-main');
  const sidebar = node('aside'); sidebar.setAttribute('aria-label', 'Saved agents');
  const create = button('New agent'), restore = button('Restore as new');
  const restoreFile = input('input', 'Restore agent file'); restoreFile.type = 'file'; restoreFile.accept = '.json,application/json'; restoreFile.hidden = true;
  const tools = node('div', null, 'pc-agent-buttons'); tools.append(create, restore, restoreFile);
  const list = node('div', null, 'pc-agent-list'); list.setAttribute('aria-label', 'Agent list');
  sidebar.append(tools, list);
  const workspace = node('section', null, 'pc-agent-workspace');
  const name = node('h3', 'Create or select an agent'); const metadata = node('p', '', 'pc-agent-note');
  const identity = node('p', '', 'pc-agent-note');
  const instructionsText = node('p', '', 'pc-agent-record-text'), summaryText = node('p', '', 'pc-agent-record-text');
  const record = node('dl', null, 'pc-agent-record');
  for (const [title, value] of [['Instructions', instructionsText], ['Goals', identity], ['Saved memory summary', summaryText]]) {
    const detail = node('dd'); detail.append(value); record.append(node('dt', title), detail);
  }
  const actions = node('div', null, 'pc-agent-buttons');
  const chat = button('Chat'), edit = button('Edit agent'), pause = button('Pause'), resume = button('Resume'), exportButton = button('Export'), remove = button('Delete agent');
  actions.append(chat, edit, pause, resume, exportButton, remove);
  const policy = node('p', '', 'pc-agent-policy');
  const note = node('p', 'Chat opens this agent in the main conversation. Resume allows new messages; it never starts a task.', 'pc-agent-note');
  workspace.append(name, metadata, actions, policy, record, note);
  main.append(sidebar, workspace);
  const editor = node('form', null, 'pc-agent-editor'); editor.hidden = true;
  const editorHeading = node('h3', 'New agent');
  const agentName = input('input', 'Agent name', 120); agentName.required = true;
  const instructions = input('textarea', 'Instructions', 16000); instructions.rows = 4;
  const goals = input('textarea', 'Goals', 8000); goals.rows = 3;
  const summary = input('textarea', 'Saved memory summary', 16000); summary.rows = 4;
  const mode = input('select', 'Inference policy'); for (const [value, label] of [['local-only', 'Local only'], ['network-assisted', 'Mixed · local first, then peers']]) { const option = node('option', label); option.value = value; mode.append(option); }
  const disclosure = node('p', 'Mixed uses a compatible local model first, then an available peer. Your instructions, goals, saved context, messages and attachments may be sent to that peer. Local only keeps execution on this device.', 'pc-agent-policy');
  const save = button('Save agent'); save.type = 'submit'; const cancelEdit = button('Cancel edit');
  const editorActions = node('div', null, 'pc-agent-buttons'); editorActions.append(save, cancelEdit);
  editor.append(editorHeading, field('Name', agentName), field('Instructions', instructions), field('Goals · one per line', goals), field('Saved memory summary', summary), field('Inference policy', mode), disclosure, editorActions);
  body.append(main, editor); element.append(header, status, body); container.append(element);
  return { element, close, status, body, main, create, restore, restoreFile, list, workspace, name, metadata, identity, instructionsText, summaryText, chat, edit, pause, resume, exportButton, remove, policy, editor, editorHeading, agentName, instructions, goals, summary, mode, save, cancelEdit };
}
