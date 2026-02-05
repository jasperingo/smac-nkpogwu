import { notFound, redirect } from 'next/navigation';
import AdminDeleteRoleAssigneeForm, { FormState } from './form';
import { deleteRoleAssignee, findRoleAssigneeAndUserById } from '@/services/role-assignee-service';

async function roleAssigneeDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const roleId = Number(formData.get('roleId')); // TODO: In v2 check that ID exists
  const roleAssigneeId = Number(formData.get('roleAssigneeId')); // TODO: In v2 check that ID exists

  try {
    await deleteRoleAssignee(roleAssigneeId);
  } catch (error) {
    console.error('Error deleting role assignee: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect(`/admin/roles/${roleId}/assignees`);
}

export default async function AdminDeleteRoleAssigneePage({ params }: Readonly<{ params: Promise<{ raid: string; }>; }>) {
  const id = Number((await params).raid);

  if (isNaN(id)) {
    notFound();
  }

  const assignee = await findRoleAssigneeAndUserById(id);

  if (assignee === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">
      
      <AdminDeleteRoleAssigneeForm 
        roleAssignee={assignee.roleAssignees} 
        roleAssigneeUser={assignee.users} 
        action={roleAssigneeDelete} 
      />

    </section>
  );
}
