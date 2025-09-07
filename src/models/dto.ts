import { UserEntity } from './entity';

export type PaginatedListDto<T> = {
  data: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
};

export type CreateUserDto = Pick<UserEntity, 
  | 'firstName' 
  | 'lastName' 
  | 'otherName' 
  | 'emailAddress' 
  | 'phoneNumber' 
  | 'password' 
  | 'dateOfBirth' 
  | 'membershipNumber'
>;

export type FindUsersDto = { page: number; pageLimit: number; };
