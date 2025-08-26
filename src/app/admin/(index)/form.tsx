'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FormInputField from '@/components/form-input-field';
import FormSubmitButton from '@/components/form-submit-button';

export type FormState = { 
  values: { id: string; password: string; };
  errors: { message: string | null; fields: { id: string | null; password: string | null; }; };
};

const initialState: FormState = { 
  values: { id: '', password: '' },
  errors: { message: null, fields: { id: null, password: null } },
};

export default function AdminIndexForm({ action }: { action: (state: FormState, formData: FormData) => Promise<FormState>; }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  return (
    <form action={formAction} className="my-20 px-2 py-8 border border-black bg-foreground md:w-96 md:mx-auto">
      <fieldset disabled={isPending}>

        <FormInputField id="identifier" name="identifier" label="Email address or Phone number" value={state.values.id} error={state.errors.fields.id} />

        <FormInputField type="password" id="password" name="password" label="Password" value={state.values.password} error={state.errors.fields.password} />

        <FormSubmitButton text="Admin Sign in" loading={isPending} />

      </fieldset>
    </form>
  );
}
