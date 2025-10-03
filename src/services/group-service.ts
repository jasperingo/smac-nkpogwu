'use server'

import { eq, like, or, sql } from 'drizzle-orm';
import { groupsTable } from '@/database/schema';
import { database } from '@/database/connection';
import { GroupEntity } from '@/models/entity';
import { CreateGroupDto, FindGroupsDto, PaginatedListDto, UpdateGroupDto } from '@/models/dto';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';

export async function groupExistByName(name: string) {
  const groups = await database.select({ id: groupsTable.id })
    .from(groupsTable)
    .where(eq(groupsTable.name, name));

  return groups.length > 0;
}

export async function findGroupById(id: number) {
  const users = await database.select().from(groupsTable).where(eq(groupsTable.id, id));

  return users.length === 0 ? null : users[0];
}

export async function findGroups(dto: FindGroupsDto): Promise<PaginatedListDto<GroupEntity>> {
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
    .limit(dto.pageLimit)
    .offset(calculatePaginationOffset(dto.page, dto.pageLimit));

  return { data: groups, currentPage: dto.page, totalItems: count, totalPages: calculatePaginationPages(count, dto.pageLimit) };
}

export async function createGroup(dto: CreateGroupDto) {
  const result = await database.insert(groupsTable).values({ ...dto }).$returningId();

  return result[0].id;
}

export async function updateGroup(groupId: number, dto: UpdateGroupDto) {
  await database.update(groupsTable).set({ ...dto, updatedDatetime: sql`NOW()` }).where(eq(groupsTable.id, groupId));

  return findGroupById(groupId);
}
