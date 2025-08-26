'use server';

import * as bcrypt from 'bcrypt';

export async function hashExecute(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function hashCompare(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
