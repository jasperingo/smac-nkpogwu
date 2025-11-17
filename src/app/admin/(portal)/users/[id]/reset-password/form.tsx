'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormCheckboxField from '@/components/form-checkbox-field';

export type FormState = { 
  success: boolean;
  error: string | null;
};

export const initialState: FormState = { 
  success: false,
  error: null,
};

export default function AdminResetUserPasswordForm({ userId, action }: { userId: number; action: (state: FormState, formData: FormData) => Promise<FormState>; }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast('User password reset completed', { type: 'success' });
    } else if (state.error) {
      toast(state.error, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Reset password" positive={false} isPending={isPending} action={formAction}>
      <input type="hidden" name="userId" value={userId} />

      <FormCheckboxField id="confirm" name="confirm" label="Confirm you want to reset this user's password" />
      
    </ButtonForm>
  );
}
