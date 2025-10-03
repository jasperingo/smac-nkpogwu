'use server'

import { eq } from 'drizzle-orm';
import { groupsTable } from '@/database/schema';
import { database } from '@/database/connection';
import { CreateGroupDto } from '@/models/dto';

export async function groupExistByName(name: string) {
  const groups = await database.select({ id: groupsTable.id })
    .from(groupsTable)
    .where(eq(groupsTable.name, name));

  return groups.length > 0;
}

export async function createGroup(dto: CreateGroupDto) {
  const result = await database.insert(groupsTable).values({ ...dto }).$returningId();

  return result[0].id;
}
