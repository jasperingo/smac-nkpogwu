'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PaginatedListDto } from '@/models/dto';
import { GroupMemberEntity, UserEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import PaginationList from '@/components/pagination-list';
import FormRadioButtonsGroup from '@/components/form-radio-buttons-group';

export type FormState = { 
  value: number;
  error: string | null;
};

const initialState: FormState = { 
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
    groupMembers: PaginatedListDto<{ users: UserEntity; groupMembers: GroupMemberEntity; }> | null;
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

            <PaginationList path={`/admin/roles/${roleId}/assignees/create`} pagination={users} params={new Map([['search', search]])} />
          </>
        )
      }

      {
        groupMembers !== null && (
          <>
            <FormRadioButtonsGroup
              name="groupMemberId"
              value={state.value}
              buttons={groupMembers.data.map((member) => ({ 
                value: member.groupMembers.id, 
                label: (
                  <>
                    <div>ID: { member.groupMembers.id }</div>
                    <div>Name: { member.users.firstName } { member.users.lastName }</div>
                    <div>Email: { member.users.emailAddress ?? '(not set)' }</div>
                    <div>Phone: { member.users.phoneNumber ?? '(not set)' }</div>
                    <div>Membership: { member.users.membershipNumber ?? '(not set)' }</div>
                  </>
                ) 
              }))}
            />

            <PaginationList path={`/admin/roles/${roleId}/assignees/create`} pagination={groupMembers} params={new Map([['search', search]])} />
          </>
        )
      }
 
      <div className="mb-4"></div>

    </ButtonForm>
  );
}
