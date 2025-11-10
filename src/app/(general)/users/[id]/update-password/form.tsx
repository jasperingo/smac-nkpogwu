'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userConstraints } from '@/models/constraints';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';

export type FormState = { 
  success: boolean;
  values: { 
    newPassword: string; 
    currentPassword: string; 
  };
  errors: { 
    message: string | null; 
    fields: { 
      newPassword: string | null; 
      currentPassword: string | null; 
    }; 
  };
};

const initialState: FormState = { 
  success: false,
  values: { 
    newPassword: '', 
    currentPassword: '' 
  },
  errors: { 
    message: null, 
    fields: { 
      newPassword: null, 
      currentPassword: null 
    } 
  },
};

export default function UpdateUserPasswordForm(
  { 
    userId,
    action
  }: { 
    userId: number;
    action: (state: FormState, formData: FormData) => Promise<FormState>; 
  }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast('Password updated', { type: 'success' });
    } else if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Update password" isPending={isPending} action={formAction}>
      
      <input type="hidden" name="userId" defaultValue={userId} />

      <FormInputField 
        type="password" 
        id="current-password" 
        name="currentPassword" 
        label="Current password" 
        minLength={userConstraints.passwordMin}
        maxLength={userConstraints.passwordMax}
        value={state.values.currentPassword} 
        error={state.errors.fields.currentPassword} 
      />

      <FormInputField 
        type="password" 
        id="new-password" 
        name="newPassword" 
        label="New password" 
        minLength={userConstraints.passwordMin}
        maxLength={userConstraints.passwordMax}
        value={state.values.newPassword} 
        error={state.errors.fields.newPassword} 
      />
      
    </ButtonForm>
  );
}
