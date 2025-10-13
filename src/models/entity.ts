import { InferSelectModel } from 'drizzle-orm';
import { 
  groupMembersTable, 
  groupsTable, 
  groupsTablePrivacyEnum, 
  programsTable, 
  roleAssigneesTable, 
  rolesTable, 
  usersTable, 
  usersTableGenderEnum 
} from '@/database/schema';

export type UserEntity = InferSelectModel<typeof usersTable>;

export const UserEntityGender = usersTableGenderEnum;

export type GroupEntity = InferSelectModel<typeof groupsTable>;

export const GroupEntityPrivacy = groupsTablePrivacyEnum;

export type GroupMemberEntity = InferSelectModel<typeof groupMembersTable>;

export type RoleEntity = InferSelectModel<typeof rolesTable>;

export type RoleAssigneeEntity = InferSelectModel<typeof roleAssigneesTable>;

export type ProgramEntity = InferSelectModel<typeof programsTable>;
