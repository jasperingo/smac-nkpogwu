'use server';

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { cookies } from 'next/headers';

const ivLength = 16;
const algorithm = 'aes-256-cbc';
const key = Buffer.from(process.env.SESSION_ENCRYPTION_KEY!, 'hex');

function encrypt(text: string) {
  const iv = randomBytes(ivLength);
  const cipher = createCipheriv(algorithm, key, iv);

  return Buffer.concat([iv, Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])]).toString('hex');
}

function decrypt(encrypted: string) {
  const encryptedBuffer = Buffer.from(encrypted, 'hex');
  const iv = encryptedBuffer.subarray(0, ivLength);
  const cipherText = encryptedBuffer.subarray(ivLength);

  const decipher = createDecipheriv(algorithm, key, iv);

  return Buffer.concat([decipher.update(cipherText), decipher.final()]).toString('utf8');
}

const cookieKey = 'server_session';

export type Session = { userId?: number; userIsAdmin?: boolean; };

export async function getSession() {
  const cookieStore = await cookies();

  const session = cookieStore.get(cookieKey);

  if (session?.value) {
    try {
      const decrypted = decrypt(session.value);

      return JSON.parse(decrypted) as Session;
    } catch (e) {
      console.error('Error fetching server cookies: ', e);
    }
  }

  return null;
}

export async function setSession(session: Session) {
  const cookieStore = await cookies();

  const encrypted = encrypt(JSON.stringify(session));

  cookieStore.set(cookieKey, encrypted);
};

export async function removeSession() {
  const cookieStore = await cookies();

  cookieStore.delete(cookieKey);
};
