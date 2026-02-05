'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormTextAreaField from '@/components/form-textarea-field';
import { ProgramActivityEntity } from '@/models/entity';

export type FormState = { 
  success: boolean;
  values: { 
    name: string; 
    description: string;
  };
  errors: { 
    message: string | null; 
    fields: { 
      name: string | null;
      description: string | null; 
    }; 
  };
};

const initialErrorState: FormState['errors'] = { 
  message: null, 
  fields: { 
    name: null,
    description: null, 
  },
};

export default function AdminUpdateProgramActivityForm(
  { 
    programActivity,
    action
  }: { 
    programActivity: ProgramActivityEntity;
    action: (state: FormState, formData: FormData) => Promise<FormState>; 
  }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, { 
    success: false,
    errors: initialErrorState,
    values: { 
      name: programActivity.name,
      description: programActivity.description ?? '',
    },
  });

  useEffect(() => {
    if (state.success) {
      toast('Program activity updated', { type: 'success' });
    } else if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Update activity" isPending={isPending} action={formAction}>
      <input type="hidden" name="programActivityId" defaultValue={programActivity.id} />

      <input type="hidden" name="programScheduleId" defaultValue={programActivity.programScheduleId} />

      <FormInputField 
        id="name" 
        name="name" 
        label="Name"
        value={state.values.name} 
        error={state.errors.fields.name} 
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
