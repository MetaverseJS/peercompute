import { privateKeyToCryptoKeyPair } from '@libp2p/crypto/keys';
import { toString as uint8ArrayToString } from 'uint8arrays/to-string';
export function toBuffer(uint8Array) {
    return Buffer.from(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
}
export async function formatAsPem(privateKey) {
    const keyPair = await privateKeyToCryptoKeyPair(privateKey);
    const exported = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    return [
        '-----BEGIN PRIVATE KEY-----',
        ...uint8ArrayToString(new Uint8Array(exported), 'base64pad').split(/(.{64})/).filter(Boolean),
        '-----END PRIVATE KEY-----'
    ].join('\n');
}
//# sourceMappingURL=pem.js.map