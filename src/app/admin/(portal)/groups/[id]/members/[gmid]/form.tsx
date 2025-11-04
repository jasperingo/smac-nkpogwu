'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { GroupMemberEntity, UserEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import FormCheckboxField from '@/components/form-checkbox-field';
import SimpleDescriptionList from '@/components/simple-description-list';

export type FormState = { 
  value: boolean;
  error: string | null;
};

export const initialState: FormState = { 
  value: false,
  error: null,
};

export default function AdminDeleteGroupMemberForm(
  { 
    groupMember,
    groupMemberUser,
    action
  }: { 
    groupMember: GroupMemberEntity;
    groupMemberUser: UserEntity | null;
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
    <ButtonForm text="Delete member" positive={false} isPending={isPending} action={formAction}>
      <input type="hidden" name="groupId" defaultValue={groupMember.groupId} />
      
      <input type="hidden" name="groupMemberId" defaultValue={groupMember.id} />

      <SimpleDescriptionList
        insideForm
        items={[
          { term: 'ID', details: groupMember.id, displayRow: true },
          { 
            term: 'Full name', 
            displayRow: true,
            details: `${groupMemberUser?.firstName} ${groupMemberUser?.lastName}`, 
          },
        ]} 
      />

      <FormCheckboxField id="confirm" name="confirm" label="Confirm you want to delete this member" />
      
    </ButtonForm>
  );
}
