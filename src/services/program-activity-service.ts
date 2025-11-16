'use server'

import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import { database } from '@/database/connection';
import { ProgramActivityEntity } from '@/models/entity';
import { programActivitiesTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateProgramActivityDto, PaginatedListDto, PaginationDto, UpdateProgramActivityDto } from '@/models/dto';

export async function programActivityExistByName(programScheduleId: number, name: string) {
  const activities = await database.select({ id: programActivitiesTable.id })
    .from(programActivitiesTable)
    .where(
      and(
        eq(programActivitiesTable.name, name),
        eq(programActivitiesTable.programScheduleId, programScheduleId),
      )
    );

  return activities.length > 0;
}

export async function findProgramActivityById(id: number): Promise<ProgramActivityEntity | null> {
  const activities = await database.select().from(programActivitiesTable).where(eq(programActivitiesTable.id, id));

  return activities.length === 0 ? null : activities[0];
}

export async function findProgramActivitiesByProgramScheduleId(
  programScheduleId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<ProgramActivityEntity>> {
  const where = eq(programActivitiesTable.programScheduleId, programScheduleId);

  const count = await database.$count(programActivitiesTable, where);

  const activities = await database.select()
    .from(programActivitiesTable)
    .where(where)
    .limit(pagination.pageLimit)
    .orderBy(asc(programActivitiesTable.createdDatetime))
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: activities, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findAllProgramActivitiesByProgramScheduleIds(programScheduleIds: number[]): Promise<ProgramActivityEntity[]> {
  const activities = await database.select()
    .from(programActivitiesTable)
    .where(inArray(programActivitiesTable.programScheduleId, programScheduleIds))
    .orderBy(asc(programActivitiesTable.createdDatetime));

  return activities;
}

export async function createProgramActivity(dto: CreateProgramActivityDto) {
  const result = await database.insert(programActivitiesTable).values({ ...dto }).$returningId();

  return result[0].id;
}

export async function updateProgramActivity(id: number, dto: UpdateProgramActivityDto) {
  const result = await database.update(programActivitiesTable)
    .set({ ...dto, updatedDatetime: sql`NOW()` })
    .where(eq(programActivitiesTable.id, id));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero program activities table rows updated');
  }

  return findProgramActivityById(id);
}

export async function deleteProgramActivity(id: number) {
  const result = await database.delete(programActivitiesTable).where(eq(programActivitiesTable.id, id));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero program activities table rows deleted');
  }
}
