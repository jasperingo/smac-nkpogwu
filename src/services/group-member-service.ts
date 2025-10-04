'use server'

import { database } from '@/database/connection';
import { groupMembersTable } from '@/database/schema';

export async function createGroupMember(userId: number, groupId: number) {
  const result = await database.insert(groupMembersTable).values({ userId, groupId }).$returningId();

  return result[0].id;
}
