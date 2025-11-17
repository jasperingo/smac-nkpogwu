import z from 'zod';

export const roleNameValidation = z.string().nonempty('This field is required');

export const rolePriorityValidation = z.number().gt(0, 'This field must be greater than zero');

export const roleContactableValidation = z.boolean();

export const roleDescriptionValidation = z.union([z.literal(''), z.string()]);
