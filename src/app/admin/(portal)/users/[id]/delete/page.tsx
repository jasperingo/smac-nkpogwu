import { redirect } from 'next/navigation';
import { deleteUser } from '@/services/user-service';
import DeleteForm, { FormState } from '@/components/delete-form';

export async function userDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const userId = Number(formData.get('userId')); // TODO: In v2 check that ID exists

  try {
    await deleteUser(userId);
  } catch (error) {
    console.error('Error deleting user: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect('/admin/users');
}

export default async function AdminDeleteUserPage({ params }: Readonly<{ params: Promise<{ id: string; }>; }>) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">
      
      <DeleteForm itemId={id} itemName="user" itemInput="userId" action={userDelete} />

    </section>
  );
}
