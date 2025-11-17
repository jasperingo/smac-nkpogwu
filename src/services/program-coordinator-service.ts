'use server'

import { and, desc, eq, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { database } from '@/database/connection';
import { ProgramCoordinatorEntity, ProgramEntity, ProgramScheduleEntity, UserEntity } from '@/models/entity';
import { programCoordinatorsTable, programSchedulesTable, programsTable, usersTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateProgramCoordinatorDto, PaginatedListDto, PaginationDto } from '@/models/dto';

export async function programCoordinatorExistByName(programScheduleId: number, name: string) {
  const coordinators = await database.select({ id: programCoordinatorsTable.id })
    .from(programCoordinatorsTable)
    .where(
      and(
        eq(programCoordinatorsTable.name, name),
        eq(programCoordinatorsTable.programScheduleId, programScheduleId),
      )
    );

  return coordinators.length > 0;
}

export async function findProgramCoordinatorAndUserById(id: number): Promise<{ programCoordinators: ProgramCoordinatorEntity; users: UserEntity | null; } | null> {
  const leftTable = alias(programCoordinatorsTable, "programCoordinators"); // used alias so result property is programCoordinators and not program_coordinators

  const coordinators = await database.select()
    .from(leftTable)
    .leftJoin(usersTable, eq(leftTable.userId, usersTable.id))
    .where(eq(leftTable.id, id));

  return coordinators.length === 0 ? null : coordinators[0];
}

export async function findProgramCoordinatorsAndUsersByProgramScheduleId(
  programScheduleId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ programCoordinators: ProgramCoordinatorEntity; users: UserEntity | null; }>> {
  const count = await database.$count(programCoordinatorsTable, eq(programCoordinatorsTable.programScheduleId, programScheduleId));

  const leftTable = alias(programCoordinatorsTable, "programCoordinators"); // used alias so result property is programCoordinators and not program_coordinators

  const coordinators = await database.select()
    .from(leftTable)
    .leftJoin(usersTable, eq(leftTable.userId, usersTable.id))
    .where(eq(leftTable.programScheduleId, programScheduleId))
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: coordinators, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findProgramCoordinatorsAndUsersByProgramScheduleIds(
  programScheduleIds: number[],
): Promise<{ programCoordinators: ProgramCoordinatorEntity; users: UserEntity | null; }[]> {
  const leftTable = alias(programCoordinatorsTable, "programCoordinators"); // used alias so result property is programCoordinators and not program_coordinators

  const coordinators = await database.select()
    .from(leftTable)
    .leftJoin(usersTable, eq(leftTable.userId, usersTable.id))
    .where(inArray(leftTable.programScheduleId, programScheduleIds))
    .orderBy(desc(leftTable.spotlighted));

  return coordinators;
}

export async function findProgramCoordinatorsAndProgramSchedulesAndProgramsByUserId(
  userId: number, 
  pagination: PaginationDto
): Promise<PaginatedListDto<{ programCoordinators: ProgramCoordinatorEntity; programSchedules: ProgramScheduleEntity | null; programs: ProgramEntity | null; }>> {
  const count = await database.$count(programCoordinatorsTable, eq(programCoordinatorsTable.userId, userId));

  const leftTable = alias(programCoordinatorsTable, "programCoordinators"); // used alias so result property is programCoordinators and not program_coordinators
  const programScheduleTable = alias(programSchedulesTable, "programSchedules"); // used alias so result property is programSchedules and not program_schedules

  const coordinators = await database.select()
    .from(leftTable)
    .leftJoin(programScheduleTable, eq(leftTable.programScheduleId, programScheduleTable.id))
    .leftJoin(programsTable, eq(programScheduleTable.programId, programsTable.id))
    .where(eq(leftTable.userId, userId))
    .orderBy(desc(programScheduleTable.startDatetime))
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return { 
    data: coordinators, 
    totalItems: count, 
    currentPage: pagination.page, 
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function createProgramCoordinator(dto: CreateProgramCoordinatorDto) {
  const result = await database.insert(programCoordinatorsTable).values({ ...dto }).$returningId();

  return result[0].id;
}

export async function deleteProgramCoordinator(id: number) {
  const result = await database.delete(programCoordinatorsTable).where(eq(programCoordinatorsTable.id, id));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero program coordinators table rows deleted');
  }
}
