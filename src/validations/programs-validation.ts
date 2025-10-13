import z from 'zod';

export const programNameValidation = z.string().nonempty('This field is required');

export const programThemeValidation = z.union([z.literal(''), z.string()]);

export const programTopicValidation = z.union([z.literal(''), z.string()]);

export const programDescriptionValidation = z.union([z.literal(''), z.string()]);
