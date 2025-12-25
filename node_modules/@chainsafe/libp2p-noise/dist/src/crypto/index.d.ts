import { pureJsCrypto } from './js.js';
import type { ICryptoInterface } from '../crypto.js';
export { pureJsCrypto };
export declare const nodeCrypto: Pick<ICryptoInterface, 'hashSHA256' | 'chaCha20Poly1305Encrypt' | 'chaCha20Poly1305Decrypt'>;
export declare const asCrypto: Pick<ICryptoInterface, 'hashSHA256' | 'chaCha20Poly1305Encrypt' | 'chaCha20Poly1305Decrypt'>;
export declare const defaultCrypto: ICryptoInterface;
//# sourceMappingURL=index.d.ts.map