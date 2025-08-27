import { redirect } from 'next/navigation';
import AdminSignOutForm from './form';
import { removeSession } from '@/utils/session';
import AdminPageHeading from '@/components/admin-page-heading';

export async function adminSignOut(state: any, formData: FormData) {
  'use server'

  await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: remove

  await removeSession();

  redirect('/admin');
}

export default async function AdminSignOutPage() {
  
  await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: remove

  return (
    <section className="bg-foreground p-4 md:w-96 md:mx-auto">
      <AdminPageHeading text="Sign out" />

      <AdminSignOutForm action={adminSignOut} />
    </section>
  );
}
