import z from 'zod';

export const roleNameValidation = z.string().nonempty('This field is required');

export const roleContactableValidation = z.boolean();

export const roleDescriptionValidation = z.union([z.literal(''), z.string()]);
