'use server'

import { eq } from 'drizzle-orm';
import { usersTable } from '@/database/schema';
import { database } from '@/database/connection';

export async function findUserById(id: number) {
  const users = await database.select().from(usersTable).where(eq(usersTable.id, id));

  return users.length === 0 ? null : users[0];
}

export async function findUserByPhoneNumber(phoneNumber: string) {
  const users = await database.select().from(usersTable).where(eq(usersTable.phoneNumber, phoneNumber));

  return users.length === 0 ? null : users[0];
}

export async function findUserByEmailAddress(emailAddress: string) {
  const users = await database.select().from(usersTable).where(eq(usersTable.emailAddress, emailAddress));

  return users.length === 0 ? null : users[0];
}
