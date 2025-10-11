'use server'

import { and, eq, isNull, like, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { rolesTable } from '@/database/schema';
import { database } from '@/database/connection';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import {  CreateRoleDto, PaginatedListDto, PaginationDto } from '@/models/dto';

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

export async function findRoleById(id: number) {
  const roles = await database.select().from(rolesTable).where(eq(rolesTable.id, id));

  return roles.length === 0 ? null : roles[0];
}

export async function createRole(dto: CreateRoleDto) {
  const result = await database.insert(rolesTable).values({ ...dto }).$returningId();

  return result[0].id;
}
