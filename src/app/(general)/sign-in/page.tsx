import z from 'zod';
import { redirect } from 'next/navigation';
import SignInForm, { FormState } from './form';
import { getSession, setSession } from '@/utils/session';
import { authenticateByIdentifier } from '@/services/authentication-service';
import { authenticationIdentifierValidation, authenticationPasswordValidation } from '@/validations/authentication-validation';
import { UserEntityStatus } from '@/models/entity';

const validationSchema = z.object({
  identifier: authenticationIdentifierValidation,
  password: authenticationPasswordValidation,
});

export async function userSignIn(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;
  
  const formValues: FormState['values'] = { id: identifier, password };

  const validatedResult = validationSchema.safeParse({ identifier, password });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formValues,
      errors: { 
        message: null, 
        fields: {
          id: errors.fieldErrors.identifier?.[0] ?? null,
          password: errors.fieldErrors.password?.[0] ?? null,
        }, 
      },
    };
  }

  const user = await authenticateByIdentifier(identifier, password);

  if (user !== null) {
    if (user.status === UserEntityStatus[1]) {
      await setSession({ userId: user.id, userIsAdmin: user.isAdministrator });
      
      redirect(`/users/${user.id}`);
    } else {
      return { 
        values: formValues,
        errors: {
          message: 'User is not activated', 
          fields: { id: null, password: null } 
        },
      };
    } 
  }

  return { 
    values: formValues,
    errors: {
      message: 'Invalid credentials', 
      fields: { id: null, password: null } 
    },
  };
}

export default async function SignInPage() {
  const session = await getSession();
   
  if (session !== null) {
    redirect(`/users/${session.userId}`);
  }

  return (
    <section className="bg-foreground md:w-96 md:mx-auto">
      <SignInForm action={userSignIn} />
    </section>
  );
}
