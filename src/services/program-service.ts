'use server'

import { eq, like, or, sql } from 'drizzle-orm';
import { ProgramEntity } from '@/models/entity';
import { database } from '@/database/connection';
import { programsTable } from '@/database/schema';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { CreateProgramDto, PaginatedListDto, PaginationDto, UpdateProgramDto } from '@/models/dto';

export async function findProgramById(id: number): Promise<ProgramEntity | null> {
  const programs = await database.select().from(programsTable).where(eq(programsTable.id, id));

  return programs.length === 0 ? null : programs[0];
}

export async function findPrograms(search: string | null, pagination: PaginationDto): Promise<PaginatedListDto<ProgramEntity>> {
  const where = search === null 
    ? undefined 
    : (
      or(
        eq(programsTable.name, search),
        like(programsTable.name, `%${search}%`),
        isNaN(Number(search)) ? undefined : eq(programsTable.id, Number(search)),
      )
    );

  const count = await database.$count(programsTable, where);

  const programs = await database.select()
    .from(programsTable)
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return {
    data: programs,
    totalItems: count,
    currentPage: pagination.page,
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findProgramsByUserId(userId: number, pagination: PaginationDto): Promise<PaginatedListDto<ProgramEntity>> {
  const where = eq(programsTable.userId, userId);

  const count = await database.$count(programsTable, where);

  const programs = await database.select()
    .from(programsTable)
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return {
    data: programs,
    totalItems: count,
    currentPage: pagination.page,
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function findProgramsByGroupId(groupId: number, pagination: PaginationDto): Promise<PaginatedListDto<ProgramEntity>> {
  const where = eq(programsTable.groupId, groupId);

  const count = await database.$count(programsTable, where);

  const programs = await database.select()
    .from(programsTable)
    .where(where)
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return {
    data: programs,
    totalItems: count,
    currentPage: pagination.page,
    totalPages: calculatePaginationPages(count, pagination.pageLimit),
  };
}

export async function createProgram(dto: CreateProgramDto) {
  const result = await database.insert(programsTable).values({ ...dto }).$returningId();

  return result[0].id;
}

export async function updateProgam(programId: number, dto: UpdateProgramDto) {
  const result = await database.update(programsTable).set({ ...dto, updatedDatetime: sql`NOW()` }).where(eq(programsTable.id, programId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero programs table rows updated');
  }

  return findProgramById(programId);
}
