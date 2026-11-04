import { sha256 } from '@noble/hashes/sha2.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import { validateImageInput } from '../../inference/modelTask.js';
import { PEER_INFERENCE_LIMITS as LIMITS, resultImage } from './protocol.js';

const byteView = (data) => new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
export const imageDigest = (data) => bytesToHex(sha256(byteView(data)));

/** One control reader owns this direction from start acknowledgement to close.
 * Only one image credit may be outstanding; no unbounded control queue exists. */
export function monitorResultControls(io, requestId, controller) {
  const { signal } = controller;
  let pending;
  const task = (async () => {
    try {
      while (!signal.aborted) {
        const frame = await io.read(signal);
        if (frame.requestId !== requestId) throw new Error('Inference control request ID mismatch');
        if (frame.type === 'cancel') throw new Error('Remote request cancelled');
        if (frame.type !== 'result-credit' || !pending || frame.offset !== pending.offset) {
          throw new Error('Unexpected inference result credit');
        }
        const ready = pending; pending = null; ready.resolve();
      }
    } catch (error) {
      controller.abort(error);
    } finally {
      pending?.reject(signal.reason ?? new Error('Inference control stream closed'));
      pending = null;
    }
  })();
  return { task, expect(offset) {
    signal.throwIfAborted();
    if (pending) throw new Error('Overlapping inference result credit');
    const promise = new Promise((resolve, reject) => { pending = { offset, resolve, reject }; });
    // A write may fail before its caller awaits the pending credit.
    promise.catch(() => {});
    return promise;
  } };
}

export function describeResultImage(image) {
  validateImageInput(image);
  return resultImage({ ...image, sha256: imageDigest(image.data) });
}

export async function writeResultImage(io, { image, metadata, requestId, controls, signal }) {
  const data = byteView(image.data);
  const ready = controls.expect(0);
  await io.write({ type: 'result-image', requestId, image: metadata }, signal);
  await ready;
  for (let offset = 0; offset < data.length;) {
    const end = Math.min(offset + LIMITS.imageChunkBytes, data.length);
    const credit = controls.expect(end);
    await io.rpc.write(data.subarray(offset, end), { signal });
    await credit;
    offset = end;
  }
}

export async function readResultImage(io, { image, requestId, signal }) {
  const metadata = resultImage(image);
  const data = new Uint8Array(metadata.width * metadata.height * 4);
  await io.write({ type: 'result-credit', requestId, offset: 0 }, signal);
  let offset = 0;
  while (offset < data.length) {
    const frame = await io.rpc.read({ signal });
    if (!frame.byteLength || frame.byteLength > LIMITS.imageChunkBytes || frame.byteLength > data.length - offset) {
      throw new Error('Invalid generated image transfer frame');
    }
    data.set(frame.subarray(), offset); offset += frame.byteLength;
    if (offset === data.length && imageDigest(data) !== metadata.sha256) throw new Error('Generated image digest mismatch');
    await io.write({ type: 'result-credit', requestId, offset }, signal);
  }
  return { ...metadata, data };
}
