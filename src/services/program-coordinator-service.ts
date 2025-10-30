'use server'

import { and, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { database } from '@/database/connection';
import { ProgramCoordinatorEntity, UserEntity } from '@/models/entity';
import { programCoordinatorsTable, usersTable } from '@/database/schema';
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

export async function createProgramCoordinator(dto: CreateProgramCoordinatorDto) {
  const result = await database.insert(programCoordinatorsTable).values({ ...dto }).$returningId();

  return result[0].id;
}
