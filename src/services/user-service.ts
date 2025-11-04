'use server'

import { and, count, eq, getTableColumns, isNull, like, not, or, sql } from 'drizzle-orm';
import { hashExecute } from '@/utils/hash';
import { UserEntity } from '@/models/entity';
import { database } from '@/database/connection';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateUserDto, FindUsersDto, PaginatedListDto, PaginationDto, UpdateUserDto } from '@/models/dto';
import { groupMembersTable, programCoordinatorsTable, roleAssigneesTable, usersTable } from '@/database/schema';

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

function getUsersSearchWhere(search?: string) {
  return search === undefined 
    ? undefined 
    : or(
        eq(usersTable.emailAddress, search),
        eq(usersTable.phoneNumber, search),
        eq(usersTable.membershipNumber, search),
        isNaN(Number(search)) ? undefined : eq(usersTable.id, Number(search)),
        like(sql`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`, `%${search}%`)
      );
}

export async function findUsers(dto: FindUsersDto): Promise<PaginatedListDto<UserEntity>> {
  const where = getUsersSearchWhere(dto.search);

  const count = await database.$count(usersTable, where);

  const users = await database.select()
    .from(usersTable)
    .where(where)
    .limit(dto.pageLimit)
    .offset(calculatePaginationOffset(dto.page, dto.pageLimit));

  return { data: users, currentPage: dto.page, totalItems: count, totalPages: calculatePaginationPages(count, dto.pageLimit) };
}

export async function findUsersNotInGroup(dto: { groupId: number; search?: string; }, pagination: PaginationDto): Promise<PaginatedListDto<UserEntity>> {
  const where = and(
    or(
      isNull(groupMembersTable.groupId),
      not(eq(groupMembersTable.groupId, dto.groupId))
    ),
    getUsersSearchWhere(dto.search),
  );
  
  const usersCount = await database.select({ value: count(usersTable.id) })
    .from(usersTable)
    .leftJoin(groupMembersTable, eq(groupMembersTable.userId, usersTable.id))
    .where(where);

  const users = await database.select({ ...getTableColumns(usersTable) })
    .from(usersTable)
    .leftJoin(groupMembersTable, eq(groupMembersTable.userId, usersTable.id))
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: users, 
    currentPage: pagination.page, 
    totalItems: usersCount[0].value, 
    totalPages: calculatePaginationPages(usersCount[0].value, pagination.pageLimit) 
  };
}

export async function findUsersNotCoordinatorInProgramSchedule(dto: { programScheduleId: number; search?: string; }, pagination: PaginationDto)
  : Promise<PaginatedListDto<UserEntity>> {
  
  const where = and(
    or(
      isNull(programCoordinatorsTable.programScheduleId),
      not(eq(programCoordinatorsTable.programScheduleId, dto.programScheduleId))
    ),
    getUsersSearchWhere(dto.search),
  );
  
  const usersCount = await database.select({ value: count(usersTable.id) })
    .from(usersTable)
    .leftJoin(programCoordinatorsTable, eq(programCoordinatorsTable.userId, usersTable.id))
    .where(where);

  const users = await database.select({ ...getTableColumns(usersTable) })
    .from(usersTable)
    .leftJoin(programCoordinatorsTable, eq(programCoordinatorsTable.userId, usersTable.id))
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: users, 
    currentPage: pagination.page, 
    totalItems: usersCount[0].value, 
    totalPages: calculatePaginationPages(usersCount[0].value, pagination.pageLimit) 
  };
}

export async function findUsersNotInRole(dto: { roleId: number; search?: string; }, pagination: PaginationDto): Promise<PaginatedListDto<UserEntity>> {
  const where = and(
    or(
      isNull(roleAssigneesTable.roleId),
      not(eq(roleAssigneesTable.roleId, dto.roleId))
    ),
    getUsersSearchWhere(dto.search),
  );
  
  const usersCount = await database.select({ value: count(usersTable.id) })
    .from(usersTable)
    .leftJoin(roleAssigneesTable, eq(roleAssigneesTable.userId, usersTable.id))
    .where(where);

  const users = await database.select({ ...getTableColumns(usersTable) })
    .from(usersTable)
    .leftJoin(roleAssigneesTable, eq(roleAssigneesTable.userId, usersTable.id))
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: users, 
    currentPage: pagination.page, 
    totalItems: usersCount[0].value, 
    totalPages: calculatePaginationPages(usersCount[0].value, pagination.pageLimit) 
  };
}

export async function createUser(dto: CreateUserDto) {
  dto.password = await (dto.password !== null ? hashExecute(dto.password) : null);
  
  const result = await database.insert(usersTable).values({ ...dto }).$returningId();

  return result[0].id;
}

export async function updateUser(userId: number, dto: UpdateUserDto) {
  dto.password = await (dto.password !== undefined ? (dto.password !== null ? hashExecute(dto.password) : null) : undefined);
  
  const result = await database.update(usersTable).set({ ...dto, updatedDatetime: sql`NOW()` }).where(eq(usersTable.id, userId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero users table rows updated');
  }

  return findUserById(userId);
}

export async function deleteUser(userId: number) {
  const result = await database.delete(usersTable).where(eq(usersTable.id, userId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero users table rows deleted');
  }
}
