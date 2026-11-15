import { mkdir, readFile, writeFile, rm, open, unlink } from 'node:fs/promises';
import { hostname } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

// Never reclaim an ambiguous lock or signal an unrelated browser process.
export async function acquireProfileLock(dataDir) {
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  const path = join(dataDir, 'host.lock');
  const owner = { pid: process.pid, hostname: hostname(), token: randomUUID() };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      await mkdir(path, { mode: 0o700 });
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      let previous;
      try { previous = JSON.parse(await readFile(join(path, 'owner.json'), 'utf8')); }
      catch { throw new Error(`Host profile is locked; inspect ${path} before recovery`); }
      if (previous.hostname !== hostname() || !Number.isInteger(previous.pid) || previous.pid < 1) {
        throw new Error('Host profile is locked by an unknown owner');
      }
      try { process.kill(previous.pid, 0); }
      catch (probe) {
        if (probe.code === 'ESRCH' && attempt === 0) {
          const recoveryPath = `${path}.recovery`;
          const recovery = await open(recoveryPath, 'wx', 0o600).catch(() => {
            throw new Error('Host profile recovery is in progress or needs inspection');
          });
          try {
            const current = JSON.parse(await readFile(join(path, 'owner.json'), 'utf8'));
            if (current.token !== previous.token || current.pid !== previous.pid) throw new Error('Host profile owner changed during recovery');
            await rm(path, { recursive: true });
          } finally { await recovery.close(); await unlink(recoveryPath); }
          continue;
        }
      }
      throw new Error(`Host profile is already owned by process ${previous.pid}`);
    }
    await writeFile(join(path, 'owner.json'), JSON.stringify(owner), { mode: 0o600 });
    let released = false;
    return async () => {
      if (released) return;
      const current = JSON.parse(await readFile(join(path, 'owner.json'), 'utf8'));
      if (current.token !== owner.token) throw new Error('Host profile lock changed owner');
      await rm(path, { recursive: true });
      released = true;
    };
  }
  throw new Error('Unable to acquire host profile');
}
