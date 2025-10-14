'use server'

import { count, eq, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { database } from '@/database/connection';
import { PaginatedListDto, PaginationDto } from '@/models/dto';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { GroupEntity, GroupMemberEntity, RoleAssigneeEntity, RoleEntity, UserEntity } from '@/models/entity';
import { groupMembersTable, groupsTable, roleAssigneesTable, rolesTable, usersTable } from '@/database/schema';

export async function findRoleAssigneesAndUsersByRoleId(
  roleId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ roleAssignees: RoleAssigneeEntity; groupMembers: GroupMemberEntity | null; users: UserEntity | null; }>> {
  const count = await database.$count(roleAssigneesTable, eq(roleAssigneesTable.roleId, roleId));
  
  const leftTable = alias(roleAssigneesTable, "roleAssignees"); // used alias so result property is roleAssignees and not role_assignees
  const groupMemberAliasTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members
  
  const assignees = await database.select()
    .from(leftTable)
    .leftJoin(groupMemberAliasTable, eq(leftTable.groupMemberId, groupMemberAliasTable.id))
    .leftJoin(usersTable, or(eq(leftTable.userId, usersTable.id), eq(groupMemberAliasTable.userId, usersTable.id)))
    .where(eq(leftTable.roleId, roleId))
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: assignees, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findRoleAssigneesAndUsersByGroupId(
  groupId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ roleAssignees: RoleAssigneeEntity; roles: RoleEntity | null; groupMembers: GroupMemberEntity | null; users: UserEntity | null; }>> {
  const leftTable = alias(roleAssigneesTable, "roleAssignees"); // used alias so result property is roleAssignees and not role_assignees
  const groupMemberAliasTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members

   const where = eq(rolesTable.groupId, groupId);

   const assigneesCount = await database.select({ value: count(leftTable.id) })
    .from(leftTable)
    .leftJoin(rolesTable, eq(rolesTable.id, leftTable.roleId))
    .where(where);
  
  const assignees = await database.select()
    .from(leftTable)
    .leftJoin(rolesTable, eq(rolesTable.id, leftTable.roleId))
    .leftJoin(groupMemberAliasTable, eq(leftTable.groupMemberId, groupMemberAliasTable.id))
    .leftJoin(usersTable, or(eq(leftTable.userId, usersTable.id), eq(groupMemberAliasTable.userId, usersTable.id)))
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: assignees, 
    currentPage: pagination.page, 
    totalItems: assigneesCount[0].value, 
    totalPages: calculatePaginationPages(assigneesCount[0].value, pagination.pageLimit),
  };
}

export async function findRoleAssigneesAndGroupsByUserId(
  userId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ roleAssignees: RoleAssigneeEntity; roles: RoleEntity | null; groupMembers: GroupMemberEntity | null; groups: GroupEntity | null; }>> {
  const leftTable = alias(roleAssigneesTable, "roleAssignees"); // used alias so result property is roleAssignees and not role_assignees
  const groupMemberAliasTable = alias(groupMembersTable, "groupMembers"); // used alias so result property is groupMembers and not group_members

   const where = or(eq(leftTable.userId, userId), eq(groupMemberAliasTable.userId, userId));

   const assigneesCount = await database.select({ value: count(leftTable.id) })
    .from(leftTable)
    .leftJoin(groupMemberAliasTable, eq(leftTable.groupMemberId, groupMemberAliasTable.id))
    .where(where);
  
  const assignees = await database.select()
    .from(leftTable)
    .leftJoin(rolesTable, eq(rolesTable.id, leftTable.roleId))
    .leftJoin(groupMemberAliasTable, eq(leftTable.groupMemberId, groupMemberAliasTable.id))
    .leftJoin(groupsTable, eq(groupMemberAliasTable.groupId, groupsTable.id))
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: assignees, 
    currentPage: pagination.page, 
    totalItems: assigneesCount[0].value, 
    totalPages: calculatePaginationPages(assigneesCount[0].value, pagination.pageLimit),
  };
}

export async function createRoleAssignee(roleId: number, value: { type: 'user'; userId: number; } | { type: 'groupMember'; groupMemberId: number; }) {
  const result = await database.insert(roleAssigneesTable).values({ 
    roleId, 
    userId: value.type === 'user' ? value.userId : null, 
    groupMemberId: value.type === 'groupMember' ? value.groupMemberId : null, 
  }).$returningId();

  return result[0].id;
}
