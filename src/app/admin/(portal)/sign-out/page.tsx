import { redirect } from 'next/navigation';
import AdminSignOutForm from './form';
import { removeSession } from '@/utils/session';

export async function adminSignOut(state: any, formData: FormData) {
  'use server'

  await removeSession();

  redirect('/admin');
}

export default async function AdminSignOutPage() {

  return (
    <section className="bg-foreground p-4 md:w-96 md:mx-auto">

      <AdminSignOutForm action={adminSignOut} />
      
    </section>
  );
}
