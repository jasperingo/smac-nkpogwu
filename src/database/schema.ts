import { sql } from 'drizzle-orm';
import { bigint, boolean, date, datetime, foreignKey, mysqlEnum, mysqlTable, serial, text, unique, varchar } from 'drizzle-orm/mysql-core';

export const usersTableGenderEnum = ['MALE', 'FEMALE'] as const;

export const usersTable = mysqlTable('users', {
  id: serial().primaryKey(),
  createdDatetime: datetime('created_datetime').notNull().default(sql`now()`),
  updatedDatetime: datetime('updated_datetime'),
  isAdministrator: boolean('is_administrator').notNull().default(false),
  title: varchar({ length: 255 }),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  otherName: varchar('other_name', { length: 255 }),
  gender: mysqlEnum(usersTableGenderEnum).notNull(),
  emailAddress: varchar('email_address', { length: 255 }).unique(),
  phoneNumber: varchar('phone_number', { length: 255 }).unique(),
  membershipNumber: varchar('membership_number', { length: 255 }).unique(),
  password: varchar({ length: 255 }),
  dateOfBirth: date('date_of_birth'),
  membershipStartDatetime: datetime('membership_start_datetime'),
  membershipEndDatetime: datetime('membership_end_datetime'),
});


export const groupsTablePrivacyEnum = ['PUBLIC', 'PRIVATE'] as const;

export const groupsTable = mysqlTable('groups', {
  id: serial().primaryKey(),
  createdDatetime: datetime('created_datetime').notNull().default(sql`now()`),
  updatedDatetime: datetime('updated_datetime'),
  parentId: bigint('parent_id', { mode: 'number', unsigned: true }),
  name: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  privacy: mysqlEnum(groupsTablePrivacyEnum).notNull().default(groupsTablePrivacyEnum[0]),
  spotlighted: boolean().notNull().default(false),
}, (table) => [
  foreignKey({
    columns: [table.parentId], 
    foreignColumns: [table.id] 
  }).onDelete('cascade').onUpdate('cascade'),
]);


export const groupMembersTable = mysqlTable('group_members', {
  id: serial().primaryKey(),
  createdDatetime: datetime('created_datetime').notNull().default(sql`now()`),
  updatedDatetime: datetime('updated_datetime'),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).notNull(),
  groupId: bigint('group_id', { mode: 'number', unsigned: true }).notNull(),
}, (table) => [
  unique().on(table.userId, table.groupId),
  foreignKey({
    columns: [table.userId], 
    foreignColumns: [usersTable.id] 
  }).onDelete('cascade').onUpdate('cascade'),
  foreignKey({
    columns: [table.groupId], 
    foreignColumns: [groupsTable.id] 
  }).onDelete('cascade').onUpdate('cascade'),
]);


export const rolesTable = mysqlTable('roles', {
  id: serial().primaryKey(),
  createdDatetime: datetime('created_datetime').notNull().default(sql`now()`),
  updatedDatetime: datetime('updated_datetime'),
  groupId: bigint('group_id', { mode: 'number', unsigned: true }),
  name: varchar({ length: 255 }).notNull().unique(),
  description: text(),
}, (table) => [
  foreignKey({
    columns: [table.groupId], 
    foreignColumns: [groupsTable.id] 
  }).onDelete('cascade').onUpdate('cascade'),
]);
