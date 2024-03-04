import { SDJwtInstance } from '@sd-jwt/core';
import { DisclosureFrame, Signer, Verifier } from '@sd-jwt/types';
import { digest, generateSalt } from '@sd-jwt/crypto-nodejs';

import Crypto, { createHmac } from 'crypto';

const secretKey = 'your-256-bit-secret';

export const createSignerVerifier = () => {
  const { privateKey, publicKey } = Crypto.generateKeyPairSync('ed25519');
  const signer: Signer = async (data: string) => {
    const signature = createHmac('sha256', secretKey).update(data).digest();
    return Buffer.from(signature).toString('base64url');
  };
  const verifier: Verifier = async (data: string, sig: string) => {
    return Crypto.verify(
      null,
      Buffer.from(data),
      publicKey,
      Buffer.from(sig, 'base64url'),
    );
  };
  return { signer, verifier };
};

(async () => {
  const { signer, verifier } = createSignerVerifier();
  const sdjwt = new SDJwtInstance({
    signer,
    verifier,
    signAlg: 'HS256',
    hasher: digest,
    hashAlg: 'SHA-256',
    saltGenerator: generateSalt,
  });

  const claims = {
    firstname: 'John',
    lastname: 'Doe',
    ssn: '123-45-6789',
    id: '1234',
  };

  const disclosureFrame: DisclosureFrame<typeof claims> = {
    _sd: ['firstname', 'id'],
  };

  const credential = await sdjwt.issue(claims, disclosureFrame);

  console.log(credential);
})();
