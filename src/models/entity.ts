import { InferSelectModel } from 'drizzle-orm';
import { 
  groupMembersTable, 
  groupsTable, 
  groupsTablePrivacyEnum, 
  programActivitiesTable, 
  programCoordinatorsTable, 
  programSchedulesTable, 
  programsTable, 
  roleAssigneesTable, 
  rolesTable, 
  usersTable, 
  usersTableGenderEnum 
} from '@/database/schema';

export const UserDefaultImage = '/images/user.png';

export type UserEntity = InferSelectModel<typeof usersTable>;

export const UserEntityGender = usersTableGenderEnum;

export const GroupDefaultImage = '/images/group.png';

export type GroupEntity = InferSelectModel<typeof groupsTable>;

export const GroupEntityPrivacy = groupsTablePrivacyEnum;

export type GroupMemberEntity = InferSelectModel<typeof groupMembersTable>;

export type RoleEntity = InferSelectModel<typeof rolesTable>;

export type RoleAssigneeEntity = InferSelectModel<typeof roleAssigneesTable>;

export const ProgramDefaultImage = '/images/program.png';

export type ProgramEntity = InferSelectModel<typeof programsTable>;

export type ProgramScheduleEntity = InferSelectModel<typeof programSchedulesTable>;

export type ProgramActivityEntity = InferSelectModel<typeof programActivitiesTable>;

export type ProgramCoordinatorEntity = InferSelectModel<typeof programCoordinatorsTable>;
