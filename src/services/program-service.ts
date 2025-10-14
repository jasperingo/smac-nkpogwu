'use server'

import { database } from '@/database/connection';
import { programsTable } from '@/database/schema';
import { CreateProgramDto } from '@/models/dto';

export async function createProgram(dto: CreateProgramDto) {
  const result = await database.insert(programsTable).values({ ...dto }).$returningId();

  return result[0].id;
}
