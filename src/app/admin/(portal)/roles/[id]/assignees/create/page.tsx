import z from 'zod';
import { redirect } from 'next/navigation';
import SearchForm from '@/components/search-form';
import AdminCreateRoleAssigneeForm, { FormState } from './form';
import { findRoleById } from '@/services/role-service';
import { resolvePaginationParams } from '@/utils/pagination';
import { findUsersNotInRole } from '@/services/user-service';
import { createRoleAssignee } from '@/services/role-assignee-service';
import { findGroupMembersAndUsersNotInRole } from '@/services/group-member-service';

const nanOrZeroValidation = z.union([z.nan(), z.literal(0)]);

const validationSchema = z.union([
  z.tuple([z.number('User not selected').gt(0, 'User not selected'), nanOrZeroValidation], 'User not selected'),
  z.tuple([nanOrZeroValidation, z.number('Group member not selected').gt(0, 'Group member not selected')], 'Group member not selected'),
], 'Invalid selection');

export async function roleAssigneeCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'
  
  const roleId = Number(formData.get('roleId'));
  const userId = Number(formData.get('userId'));
  const groupMemberId = Number(formData.get('groupMemberId'));

  const validatedResult = validationSchema.safeParse([userId, groupMemberId]);

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      value: userId || groupMemberId,
      error: errors.fieldErrors?.[0]?.[0] ?? errors.fieldErrors?.[1]?.[0] ?? errors.formErrors?.[0] ?? null,
    };
  }

  try {
    if (!isNaN(userId)) {
      await createRoleAssignee(roleId, { type: 'user', userId });
    } else {
      await createRoleAssignee(roleId, { type: 'groupMember', groupMemberId });
    }
  } catch (error) {
    console.error('Error creating role assignee: ', error);

    return { 
      value: userId || groupMemberId,
      error: error instanceof Error ? error.message : error as string,
    };
  }

  redirect(`/admin/roles/${roleId}/assignees`);
}

export default async function AdminCreateRoleAssigneePage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; search?: string; }>; }>
) {
  const id = Number((await params).id);

  const role = (await findRoleById(id))!;

  const { page, search } = await searchParams;

  let users: Awaited<ReturnType<typeof findUsersNotInRole>> | null = null;

  let groupMembers: Awaited<ReturnType<typeof findGroupMembersAndUsersNotInRole>> | null = null;

  if (role.groupId === null) {
    users = await findUsersNotInRole({ roleId: id, search: search?.length === 0 ? undefined : search }, resolvePaginationParams(page));
  }

  if (role.groupId !== null) {
    groupMembers = await findGroupMembersAndUsersNotInRole({ roleId: id, search: search?.length === 0 ? undefined : search }, resolvePaginationParams(page));
  }

  return (
    <section className="bg-foreground p-4">
      
      <SearchForm
        value={search} 
        action={`/admin/roles/${id}/assignees/create`} 
        placeholder={`Search ${role.groupId ? 'Group member' : 'User'} by ID, Name, Email, Phone or Membership`} 
      />

      <AdminCreateRoleAssigneeForm roleId={id} users={users} groupMembers={groupMembers} search={search} action={roleAssigneeCreate} />

    </section>
  );
}
