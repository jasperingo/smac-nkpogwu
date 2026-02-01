'use server'

import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { database } from '@/database/connection';
import { PaginatedListDto, PaginationDto } from '@/models/dto';
import { GroupEntity, GroupMemberEntity, UserEntity } from '@/models/entity';
import { groupMembersTable, groupsTable, usersTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';

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
    .leftJoin(groupsTable, eq(leftTable.groupId, groupsTable.id))
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

export async function findGroupMembersAndGroupsAndParentsByUserId(
  userId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ groupMembers: GroupMemberEntity; groups: GroupEntity | null; parent: GroupEntity | null; }>> {
  const count = await database.$count(groupMembersTable, eq(groupMembersTable.groupId, userId));
  
  const leftTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members
  
  const groupParentTable = alias(groupsTable, 'parent');

  const members = await database.select()
    .from(leftTable)
    .leftJoin(groupsTable, eq(leftTable.userId, groupsTable.id))
    .leftJoin(groupParentTable, eq(groupsTable.parentId, groupParentTable.id))
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
