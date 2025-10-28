'use server'

import { and, asc, eq, sql } from 'drizzle-orm';
import { database } from '@/database/connection';
import { ProgramActivityEntity } from '@/models/entity';
import { programActivitiesTable, programCoordinatorsTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateProgramActivityDto, CreateProgramCoordinatorDto, PaginatedListDto, PaginationDto, UpdateProgramActivityDto } from '@/models/dto';

export async function createProgramCoordinator(dto: CreateProgramCoordinatorDto) {
  const result = await database.insert(programCoordinatorsTable).values({ ...dto }).$returningId();

  return result[0].id;
}
