'use server'

import { and, eq, isNull, like, or, sql } from 'drizzle-orm';
import { database } from '@/database/connection';
import { groupsTable, rolesTable } from '@/database/schema';
import { GroupEntity, RoleEntity } from '@/models/entity';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateRoleDto, PaginatedListDto, PaginationDto, UpdateRoleDto } from '@/models/dto';

export async function roleExistByName(name: string) {
  const roles = await database.select({ id: rolesTable.id })
    .from(rolesTable)
    .where(and(eq(rolesTable.name, name), isNull(rolesTable.groupId)));

  return roles.length > 0;
}

export async function roleExistByNameAndGroupId(name: string, groupId: number) {
  const roles = await database.select({ id: rolesTable.id })
    .from(rolesTable)
    .where(and(eq(rolesTable.name, name), eq(rolesTable.groupId, groupId)));

  return roles.length > 0;
}

export async function findRoleById(id: number): Promise<RoleEntity | null> {
  const roles = await database.select().from(rolesTable).where(eq(rolesTable.id, id));

  return roles.length === 0 ? null : roles[0];
}

export async function findRoleAndGroupById(id: number): Promise<{ roles: RoleEntity; groups: GroupEntity | null; } | null> {
  const roles = await database.select()
    .from(rolesTable)
    .leftJoin(groupsTable, eq(rolesTable.groupId, groupsTable.id))
    .where(eq(rolesTable.id, id));

  return roles.length === 0 ? null : roles[0];
}

export async function findRolesAndGroup(
  search: string | null, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ roles: RoleEntity; groups: GroupEntity | null; }>> {
  const where = search === null 
    ? undefined 
    : (
      or(
        eq(rolesTable.name, search),
        like(rolesTable.name, `%${search}%`),
        isNaN(Number(search)) ? undefined : eq(rolesTable.id, Number(search)),
      )
    );

  const count = await database.$count(rolesTable, where);

  const roles = await database.select()
    .from(rolesTable)
    .leftJoin(groupsTable, eq(rolesTable.groupId, groupsTable.id))
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: roles, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findRolesByGroupId(
  groupId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<RoleEntity>> {
  const where = eq(rolesTable.groupId, groupId);

  const count = await database.$count(rolesTable, where);

  const roles = await database.select()
    .from(rolesTable)
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: roles, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function createRole(dto: CreateRoleDto) {
  const result = await database.insert(rolesTable).values({ ...dto }).$returningId();

  return result[0].id;
}

export async function updateRole(roleId: number, dto: UpdateRoleDto) {
  const result = await database.update(rolesTable).set({ ...dto, updatedDatetime: sql`NOW()` }).where(eq(rolesTable.id, roleId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero roles table rows updated');
  }

  return findRoleById(roleId);
}
