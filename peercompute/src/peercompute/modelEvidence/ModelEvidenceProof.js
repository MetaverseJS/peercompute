import { publicKeyFromProtobuf, publicKeyToProtobuf } from '@libp2p/crypto/keys';
import { peerIdFromPublicKey } from '@libp2p/peer-id';
import { normalizeModelEvidence } from './ModelEvidenceContracts.js';

const encode = bytes => btoa(String.fromCharCode(...bytes));
const decode = value => {
  if (typeof value !== 'string' || value.length > 512 || !/^[A-Za-z0-9+/]+={0,2}$/.test(value)) throw new TypeError('Invalid evidence proof');
  return Uint8Array.from(atob(value), char => char.charCodeAt(0));
};
const message = report => new TextEncoder().encode(`peercompute:model-evidence:v1\n${report.id}`);
export function normalizeEvidenceProof(proof) {
  const publicKey = decode(proof?.publicKey), signature = decode(proof?.signature);
  if (publicKey.length > 128 || signature.length !== 64) throw new TypeError('Invalid evidence proof');
  return { publicKey: encode(publicKey), signature: encode(signature) };
}
/** Public proof survives an ephemeral application peer's shutdown. Never persist its private key here. */
export async function signModelEvidence(input, privateKey) {
  if (privateKey?.type !== 'Ed25519') throw new TypeError('Evidence signing requires an Ed25519 application identity');
  const report = normalizeModelEvidence(input), reporterPeerId = peerIdFromPublicKey(privateKey.publicKey).toString();
  if (report.executorPeerId && report.executorPeerId !== reporterPeerId) throw new TypeError('Evidence executor differs from signer');
  return normalizeEvidenceProof({ publicKey: encode(publicKeyToProtobuf(privateKey.publicKey)), signature: encode(await privateKey.sign(message(report))) });
}
export async function verifyModelEvidence({ report: input, proof: inputProof }) {
  const report = normalizeModelEvidence(input), proof = normalizeEvidenceProof(inputProof);
  const publicKey = publicKeyFromProtobuf(decode(proof.publicKey));
  if (publicKey.type !== 'Ed25519' || !await publicKey.verify(message(report), decode(proof.signature))) throw new TypeError('Invalid evidence signature');
  const reporterPeerId = peerIdFromPublicKey(publicKey).toString();
  if (report.executorPeerId && report.executorPeerId !== reporterPeerId) throw new TypeError('Evidence executor differs from signer');
  return { report, proof, reporterPeerId };
}
