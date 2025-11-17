import { GroupEntity, ProgramActivityEntity, ProgramCoordinatorEntity, ProgramEntity, ProgramScheduleEntity, RoleEntity, UserEntity } from './entity';

export type PaginatedListDto<T> = {
  data: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type PaginationDto = { page: number; pageLimit: number; };

export type CreateUserDto = Pick<UserEntity, 
  | 'title' 
  | 'firstName' 
  | 'lastName' 
  | 'gender' 
  | 'isAdministrator' 
  | 'otherName' 
  | 'emailAddress' 
  | 'phoneNumber' 
  | 'password' 
  | 'dateOfBirth' 
  | 'membershipNumber'
  | 'membershipStartDatetime'
>;

export type UpdateUserDto = Partial<CreateUserDto & Pick<UserEntity, 'imageUrl'>>;

export type FindUsersDto = { search?: string; };

export type CreateGroupDto = Pick<GroupEntity, 'name' | 'privacy' | 'spotlighted' | 'description' | 'parentId'>;

export type UpdateGroupDto = Omit<Partial<CreateGroupDto & Pick<GroupEntity, 'imageUrl'>>, 'parentId'>;

export type FindGroupsDto = { search?: string; privacy?: GroupEntity['privacy'];  orderBySpotlightedTop?: boolean; spotlighted?: boolean;  };

export type CreateRoleDto = Pick<RoleEntity, 'name' | 'contactable' | 'description' | 'groupId'>;

export type UpdateRoleDto = Omit<Partial<CreateRoleDto>, 'groupId'>;

export type CreateProgramDto = Pick<ProgramEntity, 
  | 'name' 
  | 'theme'
  | 'topic'
  | 'description'
  | 'userId'
  | 'groupId'
>;

export type UpdateProgramDto = Partial<CreateProgramDto  & Pick<ProgramEntity, 'imageUrl'>>;

export type CreateProgramScheduleDto = Pick<ProgramScheduleEntity, 
  | 'startDatetime' 
  | 'endDatetime'
  | 'topic'
  | 'description'
  | 'programId'
>;

export type UpdateProgramScheduleDto = Omit<Partial<CreateProgramScheduleDto & Pick<ProgramScheduleEntity, 'link'>>, 'programId'>;

export type CreateProgramActivityDto = Pick<ProgramActivityEntity, 
  | 'name'
  | 'description'
  | 'programScheduleId'
>;

export type UpdateProgramActivityDto = Omit<Partial<CreateProgramActivityDto>, 'programScheduleId'>;

export type CreateProgramCoordinatorDto = Pick<ProgramCoordinatorEntity, 
  | 'role'
  | 'name'
  | 'spotlighted'
  | 'userId'
  | 'programScheduleId'
>;
