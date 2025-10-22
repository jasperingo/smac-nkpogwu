'use server'

import { and, asc, between, eq, or, sql } from 'drizzle-orm';
import { database } from '@/database/connection';
import { ProgramScheduleEntity } from '@/models/entity';
import { programActivitiesTable, programSchedulesTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateProgramActivityDto, CreateProgramScheduleDto, PaginatedListDto, PaginationDto, UpdateProgramScheduleDto } from '@/models/dto';

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

export async function createProgramActivity(dto: CreateProgramActivityDto) {
  const result = await database.insert(programActivitiesTable).values({ ...dto }).$returningId();

  return result[0].id;
}