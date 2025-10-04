import z from 'zod';
import { redirect } from 'next/navigation';
import SearchForm from '@/components/search-form';
import { resolvePaginationParams } from '@/utils/pagination';
import { findUsersNotInGroup } from '@/services/user-service';
import AdminCreateGroupMemberForm, { FormState } from './form';
import { createGroupMember } from '@/services/group-member-service';

const validationSchema = z.number('User not selected').gt(0, 'User not selected');

export async function groupMemberCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'
  
  const userId = Number(formData.get('userId'));
  const groupId = Number(formData.get('groupId'));

  const validatedResult = validationSchema.safeParse(userId);

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      value: userId,
      error: errors.formErrors?.[0] ?? null,
    };
  }

  try {
    await createGroupMember(userId, groupId);
  } catch (error) {
    console.error('Error creating group member: ', error);

    return { 
      value: userId,
      error: error instanceof Error ? error.message : error as string,
    };
  }

  redirect(`/admin/groups/${groupId}/members`);
}

export default async function AdminCreateGroupMemberPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; search?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page, search } = await searchParams;

  const users = await findUsersNotInGroup({ groupId: id, search: search?.length === 0 ? undefined : search }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">
      
      <SearchForm value={search} action={`/admin/groups/${id}/members/create`} placeholder="Search by ID, Name, Email, Phone or Membership" />

      <AdminCreateGroupMemberForm groupId={id} users={users} search={search} action={groupMemberCreate} />

    </section>
  );
}
