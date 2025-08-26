'use server'

import { hashCompare } from '@/utils/hash';
import type { UserEntity } from '@/models/entity';
import { findUserByEmailAddress, findUserByPhoneNumber } from './user-service';

async function authenticate(user: UserEntity | null, password: string) {
  if (user !== null && user.password !== null) {
    const isCorrect = await hashCompare(password, user.password);
    
    if (isCorrect) {
      return user;
    }
  }

  return null;
}

export async function authenticateByPhoneNumber(phoneNumber: string, password: string) {
  const user = await findUserByPhoneNumber(phoneNumber);

  return authenticate(user, password);
}

export async function authenticateByEmailAddress(emailAddress: string, password: string) {
  const user = await findUserByEmailAddress(emailAddress);
  
  return authenticate(user, password);
}
