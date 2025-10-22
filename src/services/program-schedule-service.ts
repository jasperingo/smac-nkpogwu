'use server'

import { and, asc, between, eq, or, sql } from 'drizzle-orm';
import { database } from '@/database/connection';
import { ProgramScheduleEntity } from '@/models/entity';
import { programSchedulesTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateProgramScheduleDto, PaginatedListDto, PaginationDto, UpdateProgramScheduleDto } from '@/models/dto';

export async function programScheduleExistByStartDatetime(programId: number, startDatetime: Date) {
  const programSchedules = await database.select({ id: programSchedulesTable.id })
    .from(programSchedulesTable)
    .where(
      and(
        eq(programSchedulesTable.programId, programId),
        eq(programSchedulesTable.startDatetime, startDatetime),
      )
    );

  return programSchedules.length > 0;
}

export async function programScheduleExistByEndDatetime(programId: number, endDatetime: Date) {
  const programSchedules = await database.select({ id: programSchedulesTable.id })
    .from(programSchedulesTable)
    .where(
      and(
        eq(programSchedulesTable.programId, programId),
        eq(programSchedulesTable.endDatetime, endDatetime),
      )
    );

  return programSchedules.length > 0;
}

export async function programScheduleExistBetweenStartDatetimeAndEndDatetime(programId: number, startDatetime: Date, endDatetime: Date) {
  const programSchedules = await database.select({ id: programSchedulesTable.id })
    .from(programSchedulesTable)
    .where(
      and(
        eq(programSchedulesTable.programId, programId),
        or(
          between(programSchedulesTable.endDatetime, startDatetime, endDatetime),
          between(programSchedulesTable.startDatetime, startDatetime, endDatetime),
        ),
      )
    );

  return programSchedules.length > 0;
}

export async function findProgramScheduleById(id: number): Promise<ProgramScheduleEntity | null> {
  const programSchedules = await database.select().from(programSchedulesTable).where(eq(programSchedulesTable.id, id));

  return programSchedules.length === 0 ? null : programSchedules[0];
}

export async function findProgramSchedulesByProgramId(
  programId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<ProgramScheduleEntity>> {
  const count = await database.$count(programSchedulesTable, eq(programSchedulesTable.programId, programId));

  const schedules = await database.select()
    .from(programSchedulesTable)
    .where(eq(programSchedulesTable.programId, programId))
    .limit(pagination.pageLimit)
    .orderBy(asc(programSchedulesTable.startDatetime))
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: schedules, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function createProgramSchedule(dto: CreateProgramScheduleDto) {
  const result = await database.insert(programSchedulesTable).values({ ...dto }).$returningId();

  return result[0].id;
}

export async function updateProgramSchedule(programScheduleId: number, dto: UpdateProgramScheduleDto) {
  const result = await database.update(programSchedulesTable)
    .set({ ...dto, updatedDatetime: sql`NOW()` })
    .where(eq(programSchedulesTable.id, programScheduleId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero program schedules table rows updated');
  }

  return findProgramScheduleById(programScheduleId);
}

export async function deleteProgramSchedule(programScheduleId: number) {
  const result = await database.delete(programSchedulesTable).where(eq(programSchedulesTable.id, programScheduleId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero program schedules table rows deleted');
  }
}
