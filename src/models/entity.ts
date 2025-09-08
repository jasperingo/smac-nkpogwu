import { InferSelectModel } from 'drizzle-orm';
import { usersTable, userTableGenderEnum } from '@/database/schema';

export type UserEntity = InferSelectModel<typeof usersTable>;

export const UserEntityGender = userTableGenderEnum;
