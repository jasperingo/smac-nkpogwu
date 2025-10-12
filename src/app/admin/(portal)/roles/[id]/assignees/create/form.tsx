'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PaginatedListDto } from '@/models/dto';
import { GroupMemberEntity, UserEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';

export type FormState = { 
  value: number;
  error: string | null;
};

export const initialState: FormState = { 
  value: 0,
  error: null,
};

export default function AdminCreateRoleAssigneeForm(
  { 
    users, 
    groupMembers,
    search, 
    roleId, 
    action 
  }: { 
    roleId: number; 
    search?: string; 
    users: PaginatedListDto<UserEntity> | null; 
    groupMembers: PaginatedListDto<{ users: UserEntity | null; groupMembers: GroupMemberEntity; }> | null;
    action: (state: FormState, formData: FormData) => Promise<FormState>; 
  }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.error) {
      toast(state.error, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Assignee role" isPending={isPending} responsiveness="none" action={formAction}>
      <input type="hidden" name="roleId" defaultValue={roleId} />

      {
        users !== null && (
          <>
            <GenericTable
              headings={[ 'Select', 'ID', 'Name', 'Email', 'Phone', 'Membership' ]}
              items={users.data}
              renderItem={(user) => (
                <tr key={user.id}>
                  <td className="p-2 border">
                    <input 
                      type="radio" 
                      name="userId" 
                      value={user.id} 
                      defaultChecked={user.id === state.value} 
                      className="w-6 h-6" 
                      required 
                    />
                  </td>
                  <td className="p-2 border">{ user.id }</td>
                  <td className="p-2 border">{ user.firstName } { user.lastName }</td>
                  <td className="p-2 border">{ user.emailAddress ?? '(not set)' }</td>
                  <td className="p-2 border">{ user.phoneNumber ?? '(not set)' }</td>
                  <td className="p-2 border">{ user.membershipNumber ?? '(not set)' }</td>
                </tr>
              )}
            />

            <PaginationList path={`/admin/roles/${roleId}/assignees/create`} pagination={users} params={new Map([['search', search]])} />
          </>
        )
      }

      {
        groupMembers !== null && (
          <>
            <GenericTable
              headings={[ 'Select', 'ID', 'User ID', 'Name', 'Email', 'Phone', 'Membership' ]}
              items={groupMembers.data}
              renderItem={(member) => (
                <tr key={member.groupMembers.id}>
                  <td className="p-2 border">
                    <input 
                      type="radio" 
                      name="groupMemberId" 
                      value={member.groupMembers.id} 
                      defaultChecked={member.groupMembers.id === state.value} 
                      className="w-6 h-6" 
                      required
                    />
                  </td>
                  <td className="p-2 border">{ member.groupMembers.id }</td>
                  <td className="p-2 border">{ member.users?.id }</td>
                  <td className="p-2 border">{ member.users?.firstName } { member.users?.lastName }</td>
                  <td className="p-2 border">{ member.users?.emailAddress ?? '(not set)' }</td>
                  <td className="p-2 border">{ member.users?.phoneNumber ?? '(not set)' }</td>
                  <td className="p-2 border">{ member.users?.membershipNumber ?? '(not set)' }</td>
                </tr>
              )}
            />

            <PaginationList path={`/admin/roles/${roleId}/assignees/create`} pagination={groupMembers} params={new Map([['search', search]])} />
          </>
        )
      }
 
      <div className="mb-4"></div>

    </ButtonForm>
  );
}
