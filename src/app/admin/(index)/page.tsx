import z from 'zod';
import { redirect } from 'next/navigation';
import AdminIndexForm, { FormState } from './form';
import { userConstraints } from '@/models/constraints';
import { getSession, setSession } from '@/utils/session';
import { authenticateByEmailAddress, authenticateByPhoneNumber } from '@/services/authentication-service';

const validationSchema = z.object({
  identifier: z.union([
    z.email(), 
    z.string().length(userConstraints.phoneNumberLength).startsWith(userConstraints.phoneNumberPrefix)
  ], 'Invalid identifier provided'),
  password: z.string('Invalid password provided')
    .min(userConstraints.passwordMin, { error: (issue) => `Password should be more than ${(issue.minimum as number) - 1} characters`, })
    .max(userConstraints.passwordMax, { error: (issue) => `Password should be less than ${(issue.maximum as number) + 1} characters`, }),
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

export default async function AdminIndexPage() {
  const session = await getSession();
  
  if (session !== null) {
    redirect('/admin/dashboard');
  }

  return (
    <section className="bg-foreground my-20 mx-2 md:w-96 md:mx-auto">
      <AdminIndexForm action={adminSignIn} />
    </section>
  );
}
