'use server'

import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { database } from '@/database/connection';
import { groupMembersTable, usersTable } from '@/database/schema';
import { PaginatedListDto, PaginationDto } from '@/models/dto';
import { GroupMemberEntity, UserEntity } from '@/models/entity';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';

export async function findGroupMembersAndUsersByGroupId(
  groupId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ groupMembers: GroupMemberEntity; users: UserEntity | null; }>> {
  const count = await database.$count(groupMembersTable, eq(groupMembersTable.groupId, groupId));
  
  const leftTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members
  
  const groups = await database.select()
    .from(leftTable)
    .leftJoin(usersTable, eq(leftTable.userId, usersTable.id))
    .where(eq(leftTable.groupId, groupId))
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: groups, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function createGroupMember(userId: number, groupId: number) {
  const result = await database.insert(groupMembersTable).values({ userId, groupId }).$returningId();

  return result[0].id;
}
