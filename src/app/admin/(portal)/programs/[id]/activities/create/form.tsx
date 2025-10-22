'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProgramScheduleEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormTextAreaField from '@/components/form-textarea-field';
import SimpleDescriptionList from '@/components/simple-description-list';

export type FormState = { 
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

export const initialState: FormState = {
  values: {
    name: '', 
    description: '', 
  },
  errors: { 
    message: null, 
    fields: { 
      name: null,
      description: null, 
    } 
  },
};

export default function AdminCreateProgramActivityForm(
  { programSchedule, action }: { programSchedule: ProgramScheduleEntity; action: (state: FormState, formData: FormData) => Promise<FormState>; }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  return (
    <ButtonForm text="Create activity" isPending={isPending} action={formAction}>
      <input type="hidden" name="programId" defaultValue={programSchedule.programId} />

      <input type="hidden" name="programScheduleId" defaultValue={programSchedule.id} />

      <div className="mb-4 border p-2 col-span-full">
        <SimpleDescriptionList
          caption="Program schedule"
          items={[
            { term: 'ID', details: programSchedule.id, displayRow: true },
            { term: 'Start date', details: programSchedule.startDatetime.toLocaleString(), displayRow: true },
            { term: 'End date', details: programSchedule.endDatetime.toLocaleString(), displayRow: true },
            { term: 'Topic', details: programSchedule.topic ?? '(Not set)', displayRow: true },
          ]} 
        />
      </div>
      
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
