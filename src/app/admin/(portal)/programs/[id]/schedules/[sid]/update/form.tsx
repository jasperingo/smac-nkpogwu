'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormTextAreaField from '@/components/form-textarea-field';
import { ProgramScheduleEntity } from '@/models/entity';
import { getDatetimeInputString } from '@/utils/datetime';

export type FormState = { 
  success: boolean;
  values: { 
    startDatetime: string; 
    endDatetime: string;
    topic: string;
    description: string; 
    link: string; 
  };
  errors: { 
    message: string | null; 
    fields: { 
      startDatetime: string | null; 
      endDatetime: string | null; 
      topic: string | null;
      description: string | null; 
      link: string | null; 
    }; 
  };
};

export const initialErrorState: FormState['errors'] = { 
  message: null, 
  fields: { 
    startDatetime: null, 
    endDatetime: null, 
    topic: null,
    description: null, 
    link: null, 
  },
};

export default function AdminUpdateProgramScheduleForm(
  { 
    programSchedule,
    action
  }: { 
    programSchedule: ProgramScheduleEntity;
    action: (state: FormState, formData: FormData) => Promise<FormState>; 
  }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, { 
    success: false,
    errors: initialErrorState,
    values: { 
      startDatetime: getDatetimeInputString(programSchedule.startDatetime), 
      endDatetime: getDatetimeInputString(programSchedule.endDatetime), 
      topic: programSchedule.topic ?? '', 
      description: programSchedule.description ?? '',
      link: programSchedule.link ?? '',
    },
  });

  useEffect(() => {
    if (state.success) {
      toast('Program schedule updated', { type: 'success' });
    } else if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Update schedule" isPending={isPending} action={formAction}>
      <input type="hidden" name="programId" defaultValue={programSchedule.programId} />

      <input type="hidden" name="programScheduleId" defaultValue={programSchedule.id} />

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

      <FormInputField 
        id="link" 
        name="link" 
        label="Link (YouTube, Facebook, etc)" 
        type="url"
        required={false}
        value={state.values.link} 
        error={state.errors.fields.link} 
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
