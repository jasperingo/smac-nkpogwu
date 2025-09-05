'use server'

import { eq } from 'drizzle-orm';
import { hashExecute } from '@/utils/hash';
import { CreateUserDto } from '@/models/dto';
import { usersTable } from '@/database/schema';
import { database } from '@/database/connection';

export async function userExistByPhoneNumber(phoneNumber: string) {
  const users = await database.select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.phoneNumber, phoneNumber));

  return users.length > 0;
}

export async function userExistByEmailAddress(emailAddress: string) {
  const users = await database.select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.emailAddress, emailAddress));

  return users.length > 0;
}

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

export async function createUser(dto: CreateUserDto) {
  const password = await (dto.password !== null ? hashExecute(dto.password) : null);
  
  const result = await database.insert(usersTable).values({ ...dto, password }).$returningId();

  return findUserById(result[0].id);
}
