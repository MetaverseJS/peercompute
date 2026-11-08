import { encryptedConnection } from './protocol.js';

const cancelled = (signal) => signal.reason instanceof Error ? signal.reason : new DOMException('Peer connection wait cancelled', 'AbortError');

/** Wait for the normal manager dial, including one already pending. Never owns or closes its connection. */
export function waitForPeerConnection({ node, peerId, signal, timeoutMs = 5000, dial, assertAllowed } = {}) {
  if (!node?.getConnections || !node.addEventListener || !node.removeEventListener
      || typeof peerId !== 'string' || !peerId || peerId.length > 128
      || typeof dial !== 'function' || typeof assertAllowed !== 'function'
      || !Number.isInteger(timeoutMs) || timeoutMs < 1 || timeoutMs > 15000) {
    throw new TypeError('Invalid bounded peer connection wait');
  }
  return new Promise((resolve, reject) => {
    let settled = false, timer;
    const finish = (error, connection) => {
      if (settled) return;
      settled = true; clearTimeout(timer);
      node.removeEventListener('connection:open', check);
      signal?.removeEventListener('abort', abort);
      if (error) reject(error); else resolve(connection);
    };
    const abort = () => finish(cancelled(signal));
    const check = () => {
      if (settled) return;
      try {
        signal?.throwIfAborted(); assertAllowed();
        const connection = node.getConnections().find((entry) => encryptedConnection(entry) && entry.remotePeer.toString() === peerId);
        if (connection) finish(null, connection);
      } catch (error) { finish(error); }
    };
    node.addEventListener('connection:open', check);
    signal?.addEventListener('abort', abort, { once: true });
    timer = setTimeout(() => finish(Object.assign(new Error('Waiting for an encrypted peer connection timed out'),
      { code: 'ERR_PEER_CONNECTION_DEADLINE' })), timeoutMs);
    timer.unref?.();
    check();
    if (!settled) {
      // Do not await the request's return value: it can be an early no-op for a
      // pending dial, or remain pending after the connection event has arrived.
      try { Promise.resolve(dial()).then(check, (error) => finish(error)); }
      catch (error) { finish(error); }
    }
  });
}
