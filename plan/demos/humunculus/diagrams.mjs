import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), 'figures');
await mkdir(out, { recursive: true });
const ink = '#173b3a', teal = '#14776d', gold = '#ad7132', blue = '#406b92';
const esc = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const text = (x, y, s, size = 22, color = ink, weight = 500) => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`;
const box = (x, y, w, h, title, lines = [], color = teal) => `<g data-box="true"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="white" stroke="${color}" stroke-width="2"/>${text(x + 18, y + 31, title, 23, color, 700)}${lines.map((s,i) => text(x + 18, y + 60 + i * 25, s, 20)).join('')}</g>`;
const arrow = (d, color = teal, dashed = false) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="3" marker-end="url(#${color.slice(1)})" ${dashed ? 'stroke-dasharray="8 6"' : ''}/>`;
const frame = (w, h, title, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(title)}"><title>${esc(title)}</title><defs>${[teal,gold,blue].map(c=>`<marker id="${c.slice(1)}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${c}"/></marker>`).join('')}</defs><g font-family="Noto Sans,Arial,sans-serif">${body}</g></svg>`;
const save = (name,w,h,title,body) => writeFile(path.join(out,`${name}.svg`), frame(w,h,title,body));

await save('architecture',1000,620,'Local neural control and asynchronous peer services',
 `<rect x="8" y="8" width="646" height="602" rx="18" fill="#eaf4ef"/>${text(28,45,'SIMULATION OWNER • FAST FEEDBACK',20,teal,700)}<rect x="674" y="8" width="318" height="602" rx="18" fill="#f1f4f8"/>${text(694,45,'LOCAL OR REMOTE SERVICES',19,blue,700)}`+
 box(35,80,240,100,'World + body',['Physics, contacts','Actions and outcomes'])+
 box(330,80,290,100,'Sensory encoders',['Vision, hearing','Proprioception'])+
 box(330,240,290,110,'Shared agent state',['Recurrent workspace','Learned attention/router'])+
 box(330,420,290,100,'Navigation policy',['Goal + observations','Local movement intent'])+
 box(35,420,240,100,'Motor policy',['State + intent','Actuator commands'])+
 box(697,90,270,110,'Language specialist',['Dialogue, goals','Curriculum proposals'],blue)+
 box(697,265,270,110,'Memory + artifacts',['Retrieval, checkpoints','Verified IPFS packages'],blue)+
 box(697,455,270,110,'Training service',['Rollouts → updates','Held-out evaluation'],gold)+
 arrow('M275 130 H330')+arrow('M475 180 V240')+arrow('M475 350 V420')+arrow('M330 470 H275')+arrow('M155 420 V180')+
 arrow('M620 270 H655 V145 H697',blue,true)+arrow('M697 320 H620',blue,true)+arrow('M697 510 H653 V500 H620',gold,true)+
 text(45,576,'Solid: control loop   ·   Dashed: asynchronous, versioned results',20));

await save('memory',1000,440,'Agent identity and versioned checkpoint artifacts',
 box(20,150,240,120,'Stable agent ID',['Independent of host','Signed head + epoch'])+
 box(335,150,270,120,'Checkpoint manifest',['Body + schema versions','Tick, RNG and state'])+
 box(690,20,285,85,'Shared parameters',['Policy / model CIDs'])+
 box(690,125,285,85,'Individual state',['Recurrent / plastic state'])+
 box(690,230,285,85,'Experience records',['Events, memories, skills'])+
 box(690,335,285,85,'Body and appearance',['Rig, dynamics, assets'])+
 arrow('M260 210 H335')+arrow('M605 210 H650 V62 H690')+arrow('M605 210 H650 V167 H690')+arrow('M605 210 H650 V272 H690')+arrow('M605 210 H650 V377 H690')+
 text(20,365,'New experience → new checkpoint CID.',21)+text(20,399,'Agent identity remains stable.',21));

await save('learning',1000,490,'Self-directed curriculum with independent evaluation',
 box(20,35,280,105,'LLM curriculum',['Review measured gaps','Propose practice task'],blue)+
 box(360,35,280,105,'Episode runner',['Pinned physics + seed','Collect real experience'])+
 box(700,35,280,105,'Learner',['PPO or world-model RL','Update specialist weights'],gold)+
 box(700,280,280,115,'Held-out evaluation',['Unseen tasks + retention','Equal compute budgets'],gold)+
 box(360,280,280,115,'Policy registry',['Accept tested checkpoint','Version / rollback'])+
 box(20,280,280,115,'Embodied agent',['Deploy learned policy','Measure new outcomes'])+
 arrow('M300 87 H360',blue)+arrow('M640 87 H700')+arrow('M840 140 V280',gold)+arrow('M700 337 H640',gold)+arrow('M360 337 H300')+arrow('M160 280 V140',blue)+
 text(24,453,'Curriculum may evolve; evaluation definitions are versioned independently.',22));

await save('speech',1000,390,'Interruptible speech perception and production',
 box(15,30,210,100,'Microphone',['Explicit capture','Bounded PCM'])+
 box(270,30,210,100,'Voice activity',['Silero VAD','Turn boundaries'])+
 box(525,30,210,100,'Recognition',['Whisper /','Moonshine'])+
 box(780,30,205,100,'Grounded turn',['Speaker + time','Observation ID'])+
 box(525,245,210,110,'Language',['Memory + scene','Reply / intent'],blue)+
 box(270,245,210,110,'Voice synthesis',['Kokoro candidate','Sentence chunks'],blue)+
 box(15,245,210,110,'Playback',['Spatial voice','Interrupt + cancel'],blue)+
 arrow('M225 80 H270')+arrow('M480 80 H525')+arrow('M735 80 H780')+arrow('M882 130 V300 H735',blue)+arrow('M525 300 H480',blue)+arrow('M270 300 H225',blue)+
 arrow('M375 130 V185 H120 V245',gold,true)+text(392,191,'New human speech cancels queued playback.',20,gold));

await save('body',1000,440,'Self-designed bodies with measured controller adaptation',
 box(20,35,280,105,'Agent body proposal',['Shape, proportions','Materials, articulation'],blue)+
 box(360,35,280,105,'Body builder',['Mesh + rig + collider','Mass and joint limits'])+
 box(700,35,280,105,'Body contract',['Sensors, actuators','Morphology descriptor'])+
 box(700,275,280,110,'Conditioned policy',['Learned control','Body-aware prediction'])+
 box(360,275,280,110,'Physics trials',['Balance / reach / move','Observe consequences'])+
 box(20,275,280,110,'Evaluation + memory',['Keep or revise design','Record gained capability'],gold)+
 arrow('M300 87 H360')+arrow('M640 87 H700')+arrow('M840 140 V275')+arrow('M700 330 H640')+arrow('M360 330 H300',gold)+arrow('M160 275 V140',blue)+
 text(25,424,'Cosmetic change preserves dynamics; physical change requires adaptation evidence.',20));

await save('fly',1000,470,'Controlled comparison for a connectome-inspired specialist',
 box(20,175,220,115,'Sensory input',['Vision / heading','Contact / body'])+
 box(325,25,350,100,'Learned recurrent policy',['Compact nonbiological baseline'])+
 box(325,180,350,100,'Connectome specialist',['Pinned graph + neural dynamics'])+
 box(325,315,350,100,'Ablated / rewired control',['Matched capacity and budget'])+
 box(765,175,220,115,'Body + task',['Action adapter','Shared metrics'])+
 arrow('M240 232 H280 V75 H325')+arrow('M240 232 H325')+arrow('M240 232 H280 V365 H325')+
 arrow('M675 75 H720 V213 H765')+arrow('M675 230 H765')+arrow('M675 365 H720 V253 H765')+
 text(21,455,'Native reproduction → numerical parity → browser closed-loop qualification',21,blue));

console.log('Generated six vector architecture diagrams.');
