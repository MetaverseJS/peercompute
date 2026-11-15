import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile, open, link, unlink, chmod, lstat } from 'node:fs/promises';
import path from 'node:path';
import { generateKeyPair, privateKeyFromProtobuf, privateKeyToProtobuf } from '@libp2p/crypto/keys';
import { peerIdFromPrivateKey } from '@libp2p/peer-id';

// The supervisor owns the profile; this lock additionally prevents two companion
// instances from advertising the same native identity at the same time.
export async function acquireIdentity(identityPath) {
  const filename = path.resolve(identityPath);
  await mkdir(path.dirname(filename), { recursive: true, mode: 0o700 });
  const lockPath = `${filename}.lock`;
  const token = randomUUID();
  let owned = false;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await writeFile(lockPath, JSON.stringify({ pid: process.pid, token }), { flag: 'wx', mode: 0o600 });
      owned = true;
      break;
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      let lock;
      try { lock = JSON.parse(await readFile(lockPath, 'utf8')); } catch { /* An incomplete live lock is not safe to steal. */ }
      let alive = true;
      if (Number.isSafeInteger(lock?.pid) && lock.pid > 0) {
        try { process.kill(lock.pid, 0); } catch (failure) { if (failure.code === 'ESRCH') alive = false; }
      }
      if (alive || attempt > 0) throw new Error('Native companion identity is already in use (or its lock needs inspection).');
      // Serialize recovery so two starters cannot remove one another's new
      // lock after both observe the same dead owner. A crashed recovery itself
      // fails closed and needs operator inspection rather than risking reuse.
      const recoveryPath = `${lockPath}.recovery`;
      const recovery = await open(recoveryPath, 'wx', 0o600).catch((failure) => {
        if (failure.code === 'EEXIST') throw new Error('Native identity lock recovery is already in progress.');
        throw failure;
      });
      try {
        const current = JSON.parse(await readFile(lockPath, 'utf8'));
        if (current.token !== lock.token || current.pid !== lock.pid) throw new Error('Native identity lock changed during recovery.');
        await unlink(lockPath);
      } finally { await recovery.close(); await unlink(recoveryPath); }
    }
  }
  const release = async () => {
    if (!owned) return;
    let current;
    try { current = JSON.parse(await readFile(lockPath, 'utf8')); } catch (error) { if (error.code === 'ENOENT') { owned = false; return; } throw error; }
    if (current.token === token) await unlink(lockPath);
    owned = false;
  };
  try {
    let raw;
    try {
      const stat = await lstat(filename);
      if (!stat.isFile()) throw new Error('Native identity path must be a regular file.');
      raw = JSON.parse(await readFile(filename, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw new Error(`Cannot read persisted native identity: ${error.message}`, { cause: error });
    }
    if (raw === undefined) {
      const privateKey = await generateKeyPair('Ed25519');
      raw = { schemaVersion: 1, peerId: peerIdFromPrivateKey(privateKey).toString(),
        privateKey: Buffer.from(privateKeyToProtobuf(privateKey)).toString('base64'), createdAt: new Date().toISOString() };
      const temporary = `${filename}.tmp-${token}`;
      try {
        const handle = await open(temporary, 'wx', 0o600);
        try { await handle.writeFile(`${JSON.stringify(raw)}\n`); await handle.sync(); } finally { await handle.close(); }
        // link is atomic and refuses to overwrite an identity created elsewhere.
        await link(temporary, filename);
      } finally { await unlink(temporary).catch((error) => { if (error.code !== 'ENOENT') throw error; }); }
    }
    if (typeof raw?.privateKey !== 'string' || !raw.privateKey || typeof raw.peerId !== 'string') {
      throw new Error('Persisted native identity is missing its key or peer ID.');
    }
    const privateKey = privateKeyFromProtobuf(Buffer.from(raw.privateKey, 'base64'));
    const peerId = peerIdFromPrivateKey(privateKey);
    if (peerId.toString() !== raw.peerId) throw new Error('Persisted native identity peer ID does not match its key.');
    await chmod(filename, 0o600);
    return { privateKey, peerId, release };
  } catch (error) { await release(); throw error; }
}
