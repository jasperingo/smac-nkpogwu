'use server'

import { and, count, eq, isNull, like, not, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { database } from '@/database/connection';
import { PaginatedListDto, PaginationDto } from '@/models/dto';
import { GroupEntity, GroupMemberEntity, UserEntity } from '@/models/entity';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { groupMembersTable, groupsTable, roleAssigneesTable, usersTable } from '@/database/schema';

export async function findGroupMemberAndUserById(id: number): Promise<{ groupMembers: GroupMemberEntity; users: UserEntity | null; } | null> {
  const leftTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members
  
  const members = await database.select()
    .from(leftTable)
    .leftJoin(usersTable, eq(leftTable.userId, usersTable.id))
    .where(eq(leftTable.id, id));

  return members.length === 0 ? null : members[0];
}

export async function findGroupMembersAndUsersByGroupId(
  groupId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ groupMembers: GroupMemberEntity; users: UserEntity | null; }>> {
  const count = await database.$count(groupMembersTable, eq(groupMembersTable.groupId, groupId));
  
  const leftTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members
  
  const members = await database.select()
    .from(leftTable)
    .leftJoin(usersTable, eq(leftTable.userId, usersTable.id))
    .where(eq(leftTable.groupId, groupId))
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: members, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findGroupMembersAndGroupsByUserId(
  userId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ groupMembers: GroupMemberEntity; groups: GroupEntity | null; }>> {
  const count = await database.$count(groupMembersTable, eq(groupMembersTable.groupId, userId));
  
  const leftTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members
  
  const members = await database.select()
    .from(leftTable)
    .leftJoin(groupsTable, eq(leftTable.userId, groupsTable.id))
    .where(eq(leftTable.userId, userId))
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: members, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findGroupMembersAndUsersNotInRole(
  dto: { roleId: number; search?: string; }, pagination: PaginationDto
): Promise<PaginatedListDto<{ users: UserEntity | null; groupMembers: GroupMemberEntity; }>> {
  const leftTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members

  const where = and(
    or(
      isNull(roleAssigneesTable.roleId),
      not(eq(roleAssigneesTable.roleId, dto.roleId))
    ),
    dto.search === undefined 
      ? undefined 
      : or(
          eq(usersTable.emailAddress, dto.search),
          eq(usersTable.phoneNumber, dto.search),
          eq(usersTable.membershipNumber, dto.search),
          isNaN(Number(dto.search)) ? undefined : eq(usersTable.id, Number(dto.search)),
          isNaN(Number(dto.search)) ? undefined : eq(leftTable.id, Number(dto.search)),
          like(sql`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`, `%${dto.search}%`)
        )
  );
  
  const membersCount = await database.select({ value: count(leftTable.id) })
    .from(leftTable)
    .leftJoin(usersTable, eq(usersTable.id, leftTable.userId))
    .leftJoin(roleAssigneesTable, eq(roleAssigneesTable.groupMemberId, leftTable.id))
    .where(where);

  const members = await database.select()
    .from(leftTable)
    .leftJoin(usersTable, eq(usersTable.id, leftTable.userId))
    .leftJoin(roleAssigneesTable, eq(roleAssigneesTable.groupMemberId, leftTable.id))
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: members, 
    currentPage: pagination.page, 
    totalItems: membersCount[0].value, 
    totalPages: calculatePaginationPages(membersCount[0].value, pagination.pageLimit) 
  };
}

export async function createGroupMember(userId: number, groupId: number) {
  const result = await database.insert(groupMembersTable).values({ userId, groupId }).$returningId();

  return result[0].id;
}

export async function deleteGroupMember(groupMemberId: number) {
  const result = await database.delete(groupMembersTable).where(eq(groupMembersTable.id, groupMemberId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero group member table rows deleted');
  }
}
