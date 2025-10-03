import { GroupEntity, UserEntity } from './entity';

export type PaginatedListDto<T> = {
  data: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type PaginationDto = { page: number; pageLimit: number; };

export type CreateUserDto = Pick<UserEntity, 
  | 'firstName' 
  | 'lastName' 
  | 'gender' 
  | 'otherName' 
  | 'emailAddress' 
  | 'phoneNumber' 
  | 'password' 
  | 'dateOfBirth' 
  | 'membershipNumber'
>;

export type UpdateUserDto = Partial<CreateUserDto>;

export type FindUsersDto = { search?: string; } & PaginationDto;

export type CreateGroupDto = Pick<GroupEntity, 'name' | 'privacy' | 'spotlighted' | 'description'>;
