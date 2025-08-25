import AdminIndexForm, { FormState } from './form';

export async function adminSignIn(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const identifier = formData.get('identifier');
  const password = formData.get('password');
 
  console.log('Admin sign in submitted: ID = ', identifier, ' & password = ', password);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  return { 
    errors: { id: 'Invalid input', password: 'Invalid input' },
    values: { id: identifier as string, password: password as string },
  };
}

export default async function AdminIndexPage() {
  return <AdminIndexForm action={adminSignIn} />;
}
