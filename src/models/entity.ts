import { InferSelectModel } from 'drizzle-orm';
import { usersTable } from '@/database/schema';

export type UserEntity = InferSelectModel<typeof usersTable>;
