'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormTextAreaField from '@/components/form-textarea-field';

export type FormState = { 
  values: { 
    name: string; 
    theme: string;
    topic: string; 
    description: string;
  };
  errors: { 
    message: string | null; 
    fields: { 
      name: string | null; 
      theme: string | null; 
      topic: string | null;
      description: string | null; 
    }; 
  };
};

export const initialState: FormState = { 
  values: { 
    name: '', 
    theme: '', 
    topic: '', 
    description: '',
  },
  errors: {
    message: null, 
    fields: { 
      name: null, 
      theme: null, 
      topic: null,
      description: null, 
    },
  },
};

export default function AdminCreateProgramForm(
  { action }: { action: (state: FormState, formData: FormData) => Promise<FormState>; }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  return (
    <ButtonForm text="Create program" isPending={isPending} action={formAction}>

      <FormInputField 
        id="name" 
        name="name" 
        label="Name" 
        value={state.values.name} 
        error={state.errors.fields.name} 
      />

      <FormInputField 
        id="theme" 
        name="theme" 
        label="Theme" 
        required={false}
        value={state.values.theme} 
        error={state.errors.fields.theme} 
      />

      <FormInputField 
        id="topic" 
        name="topic" 
        label="Topic" 
        required={false}
        value={state.values.topic} 
        error={state.errors.fields.topic} 
      />

      <FormTextAreaField 
        id="description" 
        name="description" 
        label="Description" 
        required={false} 
        value={state.values.description} 
        error={state.errors.fields.description} 
      />

    </ButtonForm>
  );
}
