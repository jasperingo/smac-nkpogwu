'use server'

import { and, count, desc, eq, getTableColumns, isNull, like, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { hashExecute } from '@/utils/hash';
import { database } from '@/database/connection';
import { GroupMemberEntity, UserEntity, UserEntityStatus } from '@/models/entity';
import { groupMembersTable, roleAssigneesTable, usersTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateUserDto, FindUsersDto, PaginatedListDto, PaginationDto, UpdateUserDto } from '@/models/dto';

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

export async function countAllUsers() {
  return database.$count(usersTable);
}

export async function findUserById(id: number): Promise<UserEntity | null> {
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

export async function findUsers(dto: FindUsersDto, pagination: PaginationDto): Promise<PaginatedListDto<UserEntity>> {
  const where = dto.status === undefined 
    ? getUsersSearchWhere(dto.search)
    : and(
        eq(usersTable.status, dto.status),
        getUsersSearchWhere(dto.search),
      );

  const count = await database.$count(usersTable, where);

  const users = await database.select()
    .from(usersTable)
    .where(where)
    .orderBy(desc(usersTable.createdDatetime))
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: users, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findUsersNotInGroup(
  dto: { 
    groupId: number; 
    status: typeof UserEntityStatus[number]; 
    search?: string; 
  }, 
  pagination: PaginationDto
): Promise<PaginatedListDto<UserEntity>> {
  const where = and(
    isNull(groupMembersTable.userId),
    eq(usersTable.status, dto.status),
    getUsersSearchWhere(dto.search),
  );
  
  const usersCount = await database.select({ value: count(usersTable.id) })
    .from(usersTable)
    .leftJoin(groupMembersTable, and(eq(groupMembersTable.userId, usersTable.id), eq(groupMembersTable.groupId, dto.groupId)))
    .where(where);

  const users = await database.select({ ...getTableColumns(usersTable) })
    .from(usersTable)
    .leftJoin(groupMembersTable, and(eq(groupMembersTable.userId, usersTable.id), eq(groupMembersTable.groupId, dto.groupId)))
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

export async function findUsersNotInRole(
  dto: { 
    roleId: number; 
    status: typeof UserEntityStatus[number]; 
    search?: string; 
  }, 
  pagination: PaginationDto
): Promise<PaginatedListDto<UserEntity>> {
  const where = and(
    isNull(roleAssigneesTable.userId),
    eq(usersTable.status, dto.status),
    getUsersSearchWhere(dto.search),
  );
  
  const usersCount = await database.select({ value: count(usersTable.id) })
    .from(usersTable)
    .leftJoin(roleAssigneesTable, and(eq(roleAssigneesTable.userId, usersTable.id), eq(roleAssigneesTable.roleId, dto.roleId)))
    .where(where);

  const users = await database.select({ ...getTableColumns(usersTable) })
    .from(usersTable)
    .leftJoin(roleAssigneesTable, and(eq(roleAssigneesTable.userId, usersTable.id), eq(roleAssigneesTable.roleId, dto.roleId)))
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

export async function findUsersNotInGroupRole(
  dto: { 
    roleId: number; 
    groupId: number; 
    status: typeof UserEntityStatus[number]; 
    search?: string; 
  }, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ users: UserEntity; groupMembers: GroupMemberEntity; }>> {
  const groupMemberAliasTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members

  const where = and(
    isNull(roleAssigneesTable.groupMemberId),
    eq(usersTable.status, dto.status),
    getUsersSearchWhere(dto.search),
  );
  
  const usersCount = await database.select({ value: count(usersTable.id) })
    .from(usersTable)
    .innerJoin(groupMemberAliasTable, and(eq(groupMemberAliasTable.userId, usersTable.id), eq(groupMemberAliasTable.groupId, dto.groupId)))
    .leftJoin(roleAssigneesTable, and(eq(roleAssigneesTable.groupMemberId, groupMemberAliasTable.id), eq(roleAssigneesTable.roleId, dto.roleId)))
    .where(where);

  const users = await database.select()
    .from(usersTable)
    .innerJoin(groupMemberAliasTable, and(eq(groupMemberAliasTable.userId, usersTable.id), eq(groupMemberAliasTable.groupId, dto.groupId)))
    .leftJoin(roleAssigneesTable, and(eq(roleAssigneesTable.groupMemberId, groupMemberAliasTable.id), eq(roleAssigneesTable.roleId, dto.roleId)))
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
