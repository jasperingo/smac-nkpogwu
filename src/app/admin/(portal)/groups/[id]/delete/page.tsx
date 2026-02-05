import { redirect } from 'next/navigation';
import { deleteGroup } from '@/services/group-service';
import DeleteForm, { FormState } from '@/components/delete-form';

async function groupDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const groupId = Number(formData.get('groupId')); // TODO: In v2 check that ID exists

  try {
    await deleteGroup(groupId);
  } catch (error) {
    console.error('Error deleting group: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect('/admin/groups');
}

export default async function AdminDeleteGroupPage({ params }: Readonly<{ params: Promise<{ id: string; }>; }>) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">
      
      <DeleteForm itemId={id} itemName="group" itemInput="groupId" action={groupDelete} />

    </section>
  );
}
