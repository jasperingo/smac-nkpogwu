import z from 'zod';
import { UserEntityGender } from '@/models/entity';
import { userConstraints } from '@/models/constraints';
import { userExistByEmailAddress, userExistByPhoneNumber } from '@/services/user-service';

export const userFirstNameValidation = z.string().nonempty('This field is required');

export const userLastNameValidation = z.string().nonempty('This field is required');

export const userOtherNameValidation = z.union([z.literal(''), z.string()]);

export const userGenderValidation = z.enum(UserEntityGender);

export const userEmailAddressValidation = z.union([
  z.literal(''), 
  z.email('Invalid email address')
    .refine(async (email) => !(await userExistByEmailAddress(email)), 'User with email address already exists')
]);

export const userPhoneNumberValidation = z.union([
  z.literal(''), 
  z.string()
    .length(userConstraints.phoneNumberLength, 'Invalid phone number')
    .startsWith(userConstraints.phoneNumberPrefix, 'Invalid phone number')
    .refine(async (phone) => !(await userExistByPhoneNumber(phone)), 'User with phone number already exists')
]);

export const userPasswordValidation = z.union([
  z.literal(''), 
  z.string('Invalid password provided')
    .min(userConstraints.passwordMin, { error: (issue) => `Password should be more than ${(issue.minimum as number) - 1} characters`, })
    .max(userConstraints.passwordMax, { error: (issue) => `Password should be less than ${(issue.maximum as number) + 1} characters`, })
]);

export const userDateOfBirthValidation = z.union([
  z.literal(''), 
  z.date('Invalid date of birth').refine((date) => date.getTime() <= Date.now(), 'Date of birth cannot be in the future')
]);

export const userMembershipValidation = z.union([z.literal(''), z.string()]);
