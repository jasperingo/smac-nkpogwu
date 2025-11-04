'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormCheckboxField from '@/components/form-checkbox-field';

export type FormState = { 
  value: boolean;
  error: string | null;
};

export const initialState: FormState = { 
  value: false,
  error: null,
};

export default function AdminDeleteUserForm({ userId, action }: { userId: number; action: (state: FormState, formData: FormData) => Promise<FormState>; }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.error) {
      toast(state.error, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Delete user" positive={false} isPending={isPending} action={formAction}>
      <input type="hidden" name="userId" defaultValue={userId} />

      <FormCheckboxField id="confirm" name="confirm" label="Confirm you want to delete this user" />
      
    </ButtonForm>
  );
}
