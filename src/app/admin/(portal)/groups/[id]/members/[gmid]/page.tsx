import { notFound, redirect } from 'next/navigation';
import AdminDeleteGroupMemberForm, { FormState } from './form';
import { deleteGroupMember, findGroupMemberAndUserById } from '@/services/group-member-service';

async function groupMemberDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const groupId = Number(formData.get('groupId')); // TODO: In v2 check that ID exists
  const groupMemberId = Number(formData.get('groupMemberId')); // TODO: In v2 check that ID exists

  try {
    await deleteGroupMember(groupMemberId);
  } catch (error) {
    console.error('Error deleting group member: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect(`/admin/groups/${groupId}/members`);
}

export default async function AdminDeleteGroupMemberPage({ params }: Readonly<{ params: Promise<{ gmid: string; }>; }>) {
  const id = Number((await params).gmid);

  if (isNaN(id)) {
    notFound();
  }

  const member = await findGroupMemberAndUserById(id);

  if (member === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">
      
      <AdminDeleteGroupMemberForm 
        groupMember={member.groupMembers} 
        groupMemberUser={member.users} 
        action={groupMemberDelete} 
      />

    </section>
  );
}
