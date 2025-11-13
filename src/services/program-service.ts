'use server'

import { and, count, desc, eq, getTableColumns, gt, isNotNull, isNull, like, lt, lte, or, sql } from 'drizzle-orm';
import { database } from '@/database/connection';
import { calculatePaginationOffset, calculatePaginationPages } from '@/utils/pagination';
import { GroupEntity, GroupEntityPrivacy, ProgramEntity, ProgramScheduleState, UserEntity } from '@/models/entity';
import { CreateProgramDto, PaginatedListDto, PaginationDto, UpdateProgramDto } from '@/models/dto';
import { groupsTable, programCoordinatorsTable, programSchedulesTable, programsTable, usersTable } from '@/database/schema';

export async function countAllPrograms() {
  return database.$count(programsTable);
}

export async function findProgramById(id: number): Promise<ProgramEntity | null> {
  const programs = await database.select().from(programsTable).where(eq(programsTable.id, id));

  return programs.length === 0 ? null : programs[0];
}

export async function findProgramAndUserAndGroupById(id: number)
  : Promise<{ programs: ProgramEntity; users: UserEntity | null; groups: GroupEntity | null; } | null> {
  const programs = await database.select()
    .from(programsTable)
    .leftJoin(usersTable, eq(usersTable.id, programsTable.userId))
    .leftJoin(groupsTable, eq(groupsTable.id, programsTable.groupId))
    .where(eq(programsTable.id, id));
  
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

export async function findProgramsAndUsersAndGroups(
  search: string | null, pagination: PaginationDto
): Promise<PaginatedListDto<{ programs: ProgramEntity; users: UserEntity | null; groups: GroupEntity | null; }>> {
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
    .leftJoin(usersTable, eq(usersTable.id, programsTable.userId))
    .leftJoin(groupsTable, eq(groupsTable.id, programsTable.groupId))
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

export async function findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
  filter: { search?: string; scheduleState?: ProgramScheduleState, publicOnly?: boolean; },
  pagination: PaginationDto
): Promise<PaginatedListDto<{ programs: ProgramEntity & { coordinators: string; startDatetime: Date; endDatetime: Date; }; users: UserEntity | null; groups: GroupEntity | null; }>> {

  const startDateSQ = database.select({ 
    programId: programSchedulesTable.programId, 
    startDatetime: sql`MIN(${programSchedulesTable.startDatetime})`.mapWith(programSchedulesTable.startDatetime).as('startDatetime')
  })
    .from(programSchedulesTable)
    .groupBy(programSchedulesTable.programId)
    .as('sdsq');
  
  const endDateSQ = database.select({ 
    programId: programSchedulesTable.programId, 
    endDatetime: sql`MAX(${programSchedulesTable.endDatetime})`.mapWith(programSchedulesTable.endDatetime).as('endDatetime') 
  })
    .from(programSchedulesTable)
    .groupBy(programSchedulesTable.programId)
    .as('edsq');
  
  const coordinatorsSQ = database.select({ 
    programId: programSchedulesTable.programId, 
    coordinators: sql<string>`GROUP_CONCAT(IF(${programCoordinatorsTable.userId} IS NULL, CONCAT(${programCoordinatorsTable.role}, '=', ${programCoordinatorsTable.name}),\
      CONCAT(${programCoordinatorsTable.role}, '=', IF(${usersTable.title} IS NULL, '', CONCAT(${usersTable.title}, ' ')), ${usersTable.firstName}, ' ', ${usersTable.lastName})) SEPARATOR '|')`.as('coordinators') 
  })
    .from(programCoordinatorsTable)
    .leftJoin(usersTable, eq(programCoordinatorsTable.userId, usersTable.id))
    .leftJoin(programSchedulesTable, eq(programCoordinatorsTable.programScheduleId, programSchedulesTable.id))
    .where(eq(programCoordinatorsTable.spotlighted, true))
    .groupBy(programSchedulesTable.programId)
    .as('csq');

  let where = filter.search === undefined
    ? undefined 
    : or(
        eq(programsTable.name, filter.search),
        like(programsTable.name, `%${filter.search}%`),
        isNaN(Number(filter.search)) ? undefined : eq(programsTable.id, Number(filter.search)),
      );

  if (filter.publicOnly) {
    where = and(where, or(
      and(isNull(programsTable.userId), isNull(programsTable.groupId)), 
      and(isNotNull(programsTable.groupId), eq(groupsTable.privacy, GroupEntityPrivacy[0]))
    ))
  }

  if (filter.scheduleState !== undefined && filter.scheduleState !== 'all') {
    switch(filter.scheduleState) {
      case 'unscheduled':
        where = and(where, isNull(startDateSQ.startDatetime), isNull(endDateSQ.endDatetime));
      break;

      case 'ended': 
        where = and(where, isNotNull(startDateSQ.startDatetime), isNotNull(endDateSQ.endDatetime), lt(endDateSQ.endDatetime, new Date()));
      break;

      case 'upcoming':
        where = and(where, isNotNull(startDateSQ.startDatetime), isNotNull(endDateSQ.endDatetime), gt(startDateSQ.startDatetime, new Date()));
      break;

      case 'ongoing':
        where = and(where, isNotNull(startDateSQ.startDatetime), isNotNull(endDateSQ.endDatetime), lte(startDateSQ.startDatetime, new Date()), gt(endDateSQ.endDatetime, new Date()));
      break;
    }
  }
  
  const programsCount = await database.select({ value: count(programsTable.id) })
    .from(programsTable)
    .leftJoin(startDateSQ, eq(startDateSQ.programId, programsTable.id))
    .leftJoin(endDateSQ, eq(endDateSQ.programId, programsTable.id))
    .leftJoin(groupsTable, eq(groupsTable.id, programsTable.groupId))
    .where(where);

  const programs = await database.select({
    programs: {
      ...getTableColumns(programsTable),
      coordinators: coordinatorsSQ.coordinators,
      startDatetime: startDateSQ.startDatetime,
      endDatetime: endDateSQ.endDatetime,
    },
    users: getTableColumns(usersTable),
    groups: getTableColumns(groupsTable),
  }).from(programsTable)
    .leftJoin(coordinatorsSQ, eq(coordinatorsSQ.programId, programsTable.id))
    .leftJoin(startDateSQ, eq(startDateSQ.programId, programsTable.id))
    .leftJoin(endDateSQ, eq(endDateSQ.programId, programsTable.id))
    .leftJoin(usersTable, eq(usersTable.id, programsTable.userId))
    .leftJoin(groupsTable, eq(groupsTable.id, programsTable.groupId))
    .where(where)
    .orderBy(desc(startDateSQ.startDatetime))
    .limit(pagination.pageLimit)
    .offset(calculatePaginationOffset(pagination.page, pagination.pageLimit));

  return {
    data: programs,
    totalItems: programsCount[0].value,
    currentPage: pagination.page,
    totalPages: calculatePaginationPages(programsCount[0].value, pagination.pageLimit),
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

export async function deleteProgram(programId: number) {
  const result = await database.delete(programsTable).where(eq(programsTable.id, programId));

  if (result[0].affectedRows < 1) {
    throw new Error('Zero program table rows deleted');
  }
}
