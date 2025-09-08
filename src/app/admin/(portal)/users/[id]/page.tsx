import Image from 'next/image';
import AdminUpdateUserForm, { FormState } from './form';
import { findUserById } from '@/services/user-service';

export async function userUpdate(state: FormState, formData: FormData): Promise<any> {
  'use server'
}

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  const user = (await findUserById(id))!;

  return (
    <section className="bg-foreground p-4">
      
      <AdminUpdateUserForm user={user} action={userUpdate} />

    </section>
  );
}
