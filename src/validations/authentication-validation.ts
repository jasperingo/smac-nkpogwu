import z from 'zod';
import { userConstraints } from '@/models/constraints';

export const authenticationIdentifierValidation = z.union([
    z.email(), 
    z.string().length(userConstraints.phoneNumberLength).startsWith(userConstraints.phoneNumberPrefix)
  ], 'Invalid identifier provided');

export const authenticationPasswordValidation = z.string('Invalid password provided')
    .min(userConstraints.passwordMin, { error: (issue) => `Password should be more than ${(issue.minimum as number) - 1} characters`, })
    .max(userConstraints.passwordMax, { error: (issue) => `Password should be less than ${(issue.maximum as number) + 1} characters`, });

