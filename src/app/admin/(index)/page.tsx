import z from 'zod';
import AdminIndexForm, { FormState } from './form';

const validationSchema = z.object({
  identifier: z.union([z.email(), z.string().length(11).startsWith('0')], 'Invalid identifier provided'),
  password: z.string('Invalid password provided').min(6, 'Password should be more than 5 characters').max(30, 'Password should be less than 31 characters'),
});

export async function adminSignIn(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: remove

  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;
 
  const validatedResult = validationSchema.safeParse({ identifier, password });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      errors: { 
        message: null, 
        fields: {
          id: errors.fieldErrors.identifier?.[0] ?? null,
          password: errors.fieldErrors.password?.[0] ?? null,
        }, 
      },
      values: { id: identifier, password: password },
    };
  }

  return { 
    errors: { message: 'Invalid credentials', fields: { id: null, password: null } },
    values: { id: identifier, password: password },
  };
}

export default async function AdminIndexPage() {
  return <AdminIndexForm action={adminSignIn} />;
}
