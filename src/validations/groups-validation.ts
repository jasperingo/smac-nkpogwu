import z from 'zod';
import { GroupEntityPrivacy } from '@/models/entity';
import { groupExistByName } from '@/services/group-service';

export const groupNameValidation = z.string()
  .nonempty('This field is required')
  .refine(async (name) => !(await groupExistByName(name)), 'Group with name already exists');

export const groupPrivacyValidation = z.enum(GroupEntityPrivacy);

export const groupSpotlightedValidation = z.boolean();

export const groupDescriptionValidation = z.union([z.literal(''), z.string()]);
