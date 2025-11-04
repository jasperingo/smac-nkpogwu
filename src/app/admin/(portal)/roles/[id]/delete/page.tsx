import { redirect } from 'next/navigation';
import { deleteRole } from '@/services/role-service';
import DeleteForm, { FormState } from '@/components/delete-form';

export async function roleDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const roleId = Number(formData.get('roleId')); // TODO: In v2 check that ID exists

  try {
    await deleteRole(roleId);
  } catch (error) {
    console.error('Error deleting role: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect('/admin/roles');
}

export default async function AdminDeleteRolePage({ params }: Readonly<{ params: Promise<{ id: string; }>; }>) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">
      
      <DeleteForm itemId={id} itemName="role" itemInput="roleId" action={roleDelete} />

    </section>
  );
}
