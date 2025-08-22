import { date, mysqlTable, serial, varchar } from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable('users', {
  id: serial().primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  emailAddress: varchar('email_address', { length: 255 }).unique(),
  phoneNumber: varchar('phone_number', { length: 255 }).unique(),
  dateOfBirth: date('date_of_birth').notNull(),
});
