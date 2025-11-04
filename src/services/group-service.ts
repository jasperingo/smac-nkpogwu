'use server'

import { eq, like, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { groupsTable } from '@/database/schema';
import { database } from '@/database/connection';
import { GroupEntity } from '@/models/entity';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateGroupDto, FindGroupsDto, PaginatedListDto, PaginationDto, UpdateGroupDto } from '@/models/dto';

export async function groupExistByName(name: string) {
  const groups = await database.select({ id: groupsTable.id })
    .from(groupsTable)
    .where(eq(groupsTable.name, name));

  return groups.length > 0;
}

export async function countAllGroups() {
  return database.$count(groupsTable);
}

export async function findGroupById(id: number): Promise<GroupEntity | null> {
  const groups = await database.select().from(groupsTable).where(eq(groupsTable.id, id));

  return groups.length === 0 ? null : groups[0];
}

export async function findGroupAndParentById(id: number) {
  const parentTable = alias(groupsTable, "parent");

  const groups = await database.select()
    .from(groupsTable)
    .leftJoin(parentTable, eq(groupsTable.parentId, parentTable.id))
    .where(eq(groupsTable.id, id));

  return groups.length === 0 ? null : groups[0];
}

export async function findGroups(dto: FindGroupsDto, pagination: PaginationDto): Promise<PaginatedListDto<GroupEntity>> {
  const where =  dto.search === undefined 
    ? undefined 
    : (
      or(
        eq(groupsTable.name, dto.search),
        like(groupsTable.name, `%${dto.search}%`),
        isNaN(Number(dto.search)) ? undefined : eq(groupsTable.id, Number(dto.search)),
      )
    );

  const count = await database.$count(groupsTable, where);

  const groups = await database.select()
    .from(groupsTable)
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: groups, 
    totalItems: count,
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findGroupsByParentId(parentId: number, pagination: PaginationDto): Promise<PaginatedListDto<GroupEntity>> {
  const where = eq(groupsTable.parentId, parentId);

  const count = await database.$count(groupsTable, where);

  const groups = await database.select()
    .from(groupsTable)
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { data: groups, currentPage: pagination.page, totalItems: count, totalPages: calculatePaginationPages(count, pagination.pageLimit) };
}

export async function createGroup(dto: CreateGroupDto) {
  const result = await database.insert(groupsTable).values({ ...dto }).$returningId();

  return result[0].id;
}

export async function updateGroup(groupId: number, dto: UpdateGroupDto) {
  const result = await database.update(groupsTable).set({ ...dto, updatedDatetime: sql`NOW()` }).where(eq(groupsTable.id, groupId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero groups table rows updated');
  }

  return findGroupById(groupId);
}

export async function deleteGroup(groupId: number) {
  const result = await database.delete(groupsTable).where(eq(groupsTable.id, groupId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero groups table rows deleted');
  }
}

