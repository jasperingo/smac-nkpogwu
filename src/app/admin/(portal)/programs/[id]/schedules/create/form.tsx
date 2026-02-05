'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormTextAreaField from '@/components/form-textarea-field';

export type FormState = { 
  values: { 
    startDatetime: string; 
    endDatetime: string;
    topic: string;
    description: string; 
  };
  errors: { 
    message: string | null; 
    fields: { 
      startDatetime: string | null; 
      endDatetime: string | null; 
      topic: string | null;
      description: string | null; 
    }; 
  };
};

const initialState: FormState = {
  values: { 
    startDatetime: '', 
    endDatetime: '',
    topic: '', 
    description: '', 
  },
  errors: { 
    message: null, 
    fields: { 
      startDatetime: null, 
      endDatetime: null, 
      topic: null,
      description: null, 
    } 
  },
};

export default function AdminCreateProgramScheduleForm(
  { programId, action }: { programId: number; action: (state: FormState, formData: FormData) => Promise<FormState>; }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  return (
    <ButtonForm text="Create schedule" isPending={isPending} action={formAction}>
      <input type="hidden" name="programId" defaultValue={programId} />

      <FormInputField 
        id="startDatetime" 
        name="startDatetime" 
        label="Start date" 
        type="datetime-local"
        value={state.values.startDatetime} 
        error={state.errors.fields.startDatetime} 
      />

      <FormInputField 
        id="endDatetime" 
        name="endDatetime" 
        label="End date" 
        type="datetime-local"
        value={state.values.endDatetime} 
        error={state.errors.fields.endDatetime} 
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
