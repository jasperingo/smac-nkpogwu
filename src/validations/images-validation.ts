import z from 'zod';

export const imageFileValidation = z.file()
  .max(10_000_000, 'The size of the provided file is too large') // 10mb
  .refine((value) => value.type.startsWith('image/'), 'The provided file is not an image') 
