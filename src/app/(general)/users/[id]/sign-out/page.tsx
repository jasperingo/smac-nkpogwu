import { redirect } from 'next/navigation';
import UserSignOutForm from './form';
import { removeSession } from '@/utils/session';

export async function userSignOut(state: any, formData: FormData) {
  'use server'

  await removeSession();

  redirect('/');
}

export default async function UserSignOutPage() {

  return (
    <section className="bg-foreground p-4">

      <UserSignOutForm action={userSignOut} />
      
    </section>
  );
}
