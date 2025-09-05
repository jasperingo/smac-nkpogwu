import { UserEntity } from './entity';

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
