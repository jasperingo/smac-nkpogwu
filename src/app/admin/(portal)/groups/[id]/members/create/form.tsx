'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserEntity } from '@/models/entity';
import { PaginatedListDto } from '@/models/dto';
import ButtonForm from '@/components/button-form';
import PaginationList from '@/components/pagination-list';
import FormRadioButtonsGroup from '@/components/form-radio-buttons-group';

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

      <FormRadioButtonsGroup
        name="userId"
        value={state.value}
        buttons={users.data.map((user) => ({ 
          value: user.id, 
          label: (
            <>
              <div>ID: { user.id }</div>
              <div>Name: { user.firstName } { user.lastName }</div>
              <div>Email: { user.emailAddress ?? '(not set)' }</div>
              <div>Phone: { user.phoneNumber ?? '(not set)' }</div>
              <div>Membership: { user.membershipNumber ?? '(not set)' }</div>
            </>
          ) 
        }))}
      />

      <PaginationList path={`/admin/groups/${groupId}/members/create`} pagination={users} params={new Map([['search', search]])} />
 
      <div className="mb-4"></div>

    </ButtonForm>
  );
}
