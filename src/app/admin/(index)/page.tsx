import z from 'zod';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminIndexForm, { FormState } from './form';
import { getSession, setSession } from '@/utils/session';
import { authenticateByEmailAddress, authenticateByPhoneNumber } from '@/services/authentication-service';

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

  const user = identifier.includes('@') 
    ? await authenticateByEmailAddress(identifier, password)
    : await authenticateByPhoneNumber(identifier, password);

  if (user !== null) {
    await setSession({ userId: user.id, userIsAdmin: user.isAdministrator });

    redirect('/admin/dashboard');
  }

  return { 
    errors: { message: 'Invalid credentials', fields: { id: null, password: null } },
    values: { id: identifier, password: password },
  };
}

export const metadata: Metadata = {
  title: 'Admin sign in - ST Matthew\'s Anglican Church',
};

export default async function AdminIndexPage() {
  const session = await getSession();
  
  if (session !== null) {
    redirect('/admin/dashboard');
  }

  return <AdminIndexForm action={adminSignIn} />;
}
