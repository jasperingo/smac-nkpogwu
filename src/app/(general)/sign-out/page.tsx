import { redirect } from 'next/navigation';
import SignOutForm from './form';
import { getSession, removeSession } from '@/utils/session';

export async function userSignOut(state: any, formData: FormData) {
  'use server'

  await removeSession();

  redirect('/');
}

export default async function SignOutPage() {
  const session = await getSession();

  if (session === null) {
    redirect('/sign-in');
  }

  return (
    <section className="bg-foreground p-4">

      <SignOutForm action={userSignOut} />
      
    </section>
  );
}
