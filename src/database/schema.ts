import { sql } from 'drizzle-orm';
import { boolean, date, datetime, mysqlEnum, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: serial().primaryKey(),
  createdDatetime: datetime('created_datetime').notNull().default(sql`now()`),
  updatedDatetime: datetime('updated_datetime'),
  isAdministrator: boolean('is_administrator').notNull().default(false),
  title: varchar({ length: 255 }),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  otherName: varchar('other_name', { length: 255 }),
  gender: mysqlEnum(['MALE', 'FEMALE']).notNull(),
  emailAddress: varchar('email_address', { length: 255 }).unique(),
  phoneNumber: varchar('phone_number', { length: 255 }).unique(),
  membershipNumber: varchar('membership_number', { length: 255 }).unique(),
  password: varchar({ length: 255 }),
  dateOfBirth: date('date_of_birth'),
  membershipStartDatetime: datetime('membership_start_datetime'),
  membershipEndDatetime: datetime('membership_end_datetime'),
});
