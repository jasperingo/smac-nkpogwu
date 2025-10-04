'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserEntity } from '@/models/entity';
import { PaginatedListDto } from '@/models/dto';
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

export default function AdminCreateGroupMemberForm(
  { 
    users, 
    search, 
    groupId, 
    action 
  }: { 
    groupId: number; 
    search?: string; 
    users: PaginatedListDto<UserEntity>; 
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
    <ButtonForm text="Add group member" isPending={isPending} responsiveness="none" action={formAction}>
      <input type="hidden" name="groupId" defaultValue={groupId} />

      <GenericTable
        headings={[ 'Select', 'ID', 'Name', 'Email', 'Phone', 'Membership' ]}
        items={users.data}
        renderItem={(user) => (
          <tr key={user.id}>
            <td className="p-2 border">
              <input type="radio" name="userId" value={user.id} defaultChecked={user.id === state.value} className="w-6 h-6" />
            </td>
            <td className="p-2 border">{ user.id }</td>
            <td className="p-2 border">{ user.firstName } { user.lastName }</td>
            <td className="p-2 border">{ user.emailAddress ?? '(not set)' }</td>
            <td className="p-2 border">{ user.phoneNumber ?? '(not set)' }</td>
            <td className="p-2 border">{ user.membershipNumber ?? '(not set)' }</td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/groups/${groupId}/members/create`} pagination={users} params={new Map([['search', search]])} />
 
      <div className="mb-4"></div>

    </ButtonForm>
  );
}
