import { InferSelectModel } from 'drizzle-orm';
import { groupsTable, groupsTablePrivacyEnum, usersTable, usersTableGenderEnum } from '@/database/schema';

export type UserEntity = InferSelectModel<typeof usersTable>;

export const UserEntityGender = usersTableGenderEnum;

export type GroupEntity = InferSelectModel<typeof groupsTable>;

export const GroupEntityPrivacy = groupsTablePrivacyEnum;
