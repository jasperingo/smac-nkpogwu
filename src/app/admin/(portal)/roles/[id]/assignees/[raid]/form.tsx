'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { RoleAssigneeEntity, UserEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import FormCheckboxField from '@/components/form-checkbox-field';
import SimpleDescriptionList from '@/components/simple-description-list';

export type FormState = { 
  value: boolean;
  error: string | null;
};

const initialState: FormState = { 
  value: false,
  error: null,
};

export default function AdminDeleteRoleAssigneeForm(
  { 
    roleAssignee,
    roleAssigneeUser,
    action
  }: { 
    roleAssignee: RoleAssigneeEntity;
    roleAssigneeUser: UserEntity | null;
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
    <ButtonForm text="Delete assignee" positive={false} isPending={isPending} action={formAction}>
      <input type="hidden" name="roleId" defaultValue={roleAssignee.roleId} />
      
      <input type="hidden" name="roleAssigneeId" defaultValue={roleAssignee.id} />

      <SimpleDescriptionList
        insideForm
        items={[
          { term: 'ID', details: roleAssignee.id, displayRow: true },
          { 
            term: 'Full name', 
            displayRow: true,
            details: `${roleAssigneeUser?.firstName} ${roleAssigneeUser?.lastName}`, 
          },
        ]} 
      />

      <FormCheckboxField id="confirm" name="confirm" label="Confirm you want to delete this assignee" />
      
    </ButtonForm>
  );
}
