'use server'

import { and, between, eq, like, or, sql } from 'drizzle-orm';
import { database } from '@/database/connection';
import { GroupEntity, ProgramEntity, ProgramScheduleEntity, UserEntity } from '@/models/entity';
import { groupsTable, programSchedulesTable, programsTable, usersTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateProgramDto, CreateProgramScheduleDto, PaginatedListDto, PaginationDto, UpdateProgramDto } from '@/models/dto';

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

export async function createProgramSchedule(dto: CreateProgramScheduleDto) {
  const result = await database.insert(programSchedulesTable).values({ ...dto }).$returningId();

  return result[0].id;
}
