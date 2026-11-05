import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.join(path.dirname(fileURLToPath(import.meta.url)), 'figures');
await mkdir(directory, { recursive: true });
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const text = (x, y, value, size = 21, anchor = 'middle', color = '#234d42') =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" fill="${color}">${escape(value)}</text>`;
function box(x, y, width, height, lines, planned = false) {
  const start = y + height / 2 - (lines.length - 1) * 13 + 7;
  return `<g data-box="true"><rect x="${x}" y="${y}" width="${width}" height="${height}" rx="8"
    fill="${planned ? '#fff7e8' : '#edf6f1'}" stroke="${planned ? '#a7803b' : '#438269'}" stroke-width="2"
    ${planned ? 'stroke-dasharray="7 4"' : ''}/>${lines.map((line, i) => text(x + width / 2, start + i * 26, line, i ? 20 : 22)).join('')}</g>`;
}
function arrow(d, { both = false, planned = false } = {}) {
  return `<path d="${d}" fill="none" stroke="${planned ? '#987333' : '#438269'}" stroke-width="2.5"
    marker-end="url(#arrow)" ${both ? 'marker-start="url(#back)"' : ''} ${planned ? 'stroke-dasharray="7 4"' : ''}/>`;
}
function svg(height, title, content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}" role="img">
  <title>${escape(title)}</title><defs>
  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#438269"/></marker>
  <marker id="back" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M 10 0 L 0 5 L 10 10 Z" fill="#438269"/></marker>
  </defs><g font-family="Arial, sans-serif">${content}</g></svg>`;
}

const architecture = svg(525, 'General agent integrated with PeerCompute managers and an optional routing peer', `
  <rect x="10" y="8" width="765" height="457" rx="12" fill="#fbfdfc" stroke="#a6bdb3" stroke-width="2"/>
  <rect x="825" y="8" width="365" height="457" rx="12" fill="#fbfdfc" stroke="#a6bdb3" stroke-width="2"/>
  ${text(32, 36, 'OWNING PEER — browser or installed PWA', 22, 'start')}
  ${text(1007, 36, 'OTHER PEER', 22)}
  ${box(35, 60, 320, 75, ['General agent + policy', 'identity, goals, decisions'], true)}
  ${box(410, 60, 340, 75, ['AgentRouter', 'local ML / checked peer scores'], true)}
  ${box(35, 175, 320, 75, ['StateManager', 'new private AgentRecordStore'], true)}
  ${box(35, 275, 320, 65, ['IndexedDB', 'private context + journal'], true)}
  ${box(35, 365, 320, 65, ['ArtifactStore / IPFS', 'verified model weights'])}
  ${box(410, 200, 340, 90, ['NetworkManager', 'discovery + private streams'])}
  ${box(410, 350, 340, 90, ['Model service + admission', 'ComputeManager worker', 'WebGPU'])}
  ${box(845, 60, 320, 75, ['Optional peer ML router', 'ComputeManager scoring task'], true)}
  ${box(845, 200, 320, 90, ['NetworkManager', 'inference + new ranking'])}
  ${box(845, 350, 320, 90, ['Model service + admission', 'ComputeManager worker', 'WebGPU'])}
  ${arrow('M 355 97 L 410 97', { both: true, planned: true })}
  ${arrow('M 195 135 L 195 175', { both: true, planned: true })}
  ${arrow('M 195 250 L 195 275', { both: true, planned: true })}
  ${arrow('M 355 212 L 375 212 L 375 397 L 355 397')}
  ${arrow('M 355 420 L 390 448 L 580 448 L 580 440')}
  ${arrow('M 410 120 L 390 120 L 390 380 L 410 380', { both: true, planned: true })}
  ${arrow('M 580 135 L 580 200', { both: true, planned: true })}
  ${arrow('M 750 245 L 845 245', { both: true })}
  ${arrow('M 1005 200 L 1005 135', { both: true, planned: true })}
  ${arrow('M 1005 290 L 1005 350', { both: true })}
  ${text(600, 492, 'Solid green: existing managers. Dashed amber: proposed agent, private store and ranking paths.', 21)}
  ${text(600, 518, 'Model files remain separate from private agent context. Inference and routing executors see the data sent to them.', 20)}
`);

const cycle = svg(230, 'Request lifecycle through routing, managed inference and an agent checkpoint', `
  ${box(5, 24, 165, 85, ['Task', 'user goal'], true)}
  ${box(210, 24, 165, 85, ['Context +', 'eligibility'], true)}
  ${box(415, 24, 165, 85, ['ML ranking', 'local / peer'], true)}
  ${box(620, 24, 165, 85, ['Revalidate +', 'choose host'], true)}
  ${box(825, 24, 165, 85, ['Managed', 'execution'])}
  ${box(1030, 24, 165, 85, ['Validate +', 'save result'], true)}
  ${[170, 375, 580, 785, 990].map(x => arrow(`M ${x} 66 L ${x + 40} 66`)).join('')}
  ${arrow('M 1112 109 L 1112 190 L 87 190 L 87 109', { planned: true })}
  ${text(600, 157, 'Next step keeps the same identity; stop on completion, cancellation or budget.', 22)}
  ${text(600, 222, 'Local-only excludes remote inference and remote routing. Peer scores always return to local checks.', 21)}
`);

await writeFile(path.join(directory, 'agent-peercompute.svg'), architecture);
await writeFile(path.join(directory, 'agent-request-cycle.svg'), cycle);
