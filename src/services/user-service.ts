'use server'

import { eq, like, or, sql } from 'drizzle-orm';
import { hashExecute } from '@/utils/hash';
import { UserEntity } from '@/models/entity';
import { usersTable } from '@/database/schema';
import { database } from '@/database/connection';
import { CreateUserDto, FindUsersDto, PaginatedListDto, UpdateUserDto } from '@/models/dto';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';

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

export async function findUsers(dto: FindUsersDto): Promise<PaginatedListDto<UserEntity>> {
  const where =  dto.search === undefined 
    ? undefined 
    : (
      or(
        eq(usersTable.emailAddress, dto.search),
        eq(usersTable.phoneNumber, dto.search),
        eq(usersTable.membershipNumber, dto.search),
        isNaN(Number(dto.search)) ? undefined : eq(usersTable.id, Number(dto.search)),
        like(sql`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`, `%${dto.search}%`)
      )
    );

  const count = await database.$count(usersTable, where);

  const users = await database.select()
    .from(usersTable)
    .where(where)
    .limit(dto.pageLimit)
    .offset(calculatePaginationOffset(dto.page, dto.pageLimit));

  return { data: users, currentPage: dto.page, totalItems: count, totalPages: calculatePaginationPages(count, dto.pageLimit) };
}

export async function createUser(dto: CreateUserDto) {
  const password = await (dto.password !== null ? hashExecute(dto.password) : null);
  
  const result = await database.insert(usersTable).values({ ...dto, password }).$returningId();

  return findUserById(result[0].id);
}

export async function updateUser(userId: number, dto: UpdateUserDto) {
  dto.password = await (dto.password !== undefined ? (dto.password !== null ? hashExecute(dto.password) : null) : undefined);
  
  await database.update(usersTable).set({ ...dto, updatedDatetime: sql`NOW()` }).where(eq(usersTable.id, userId));

  return findUserById(userId);
}
