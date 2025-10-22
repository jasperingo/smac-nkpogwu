'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProgramScheduleEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import FormCheckboxField from '@/components/form-checkbox-field';
import SimpleDescriptionList from '@/components/simple-description-list';

export type FormState = { 
  value: boolean;
  error: string | null;
};

export const initialState: FormState = { 
  value: false,
  error: null,
};

export default function AdminDeleteProgramScheduleForm(
  { 
    programSchedule,
    action
  }: { 
    programSchedule: ProgramScheduleEntity;
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
    <ButtonForm text="Delete schedule" positive={false} isPending={isPending} action={formAction}>
      <input type="hidden" name="programId" defaultValue={programSchedule.programId} />
      
      <input type="hidden" name="programScheduleId" defaultValue={programSchedule.id} />

      <div className="mb-4 border p-2 col-span-full">
        <SimpleDescriptionList
          items={[
            { term: 'ID', details: programSchedule.id, displayRow: true },
            { term: 'Start date', details: programSchedule.startDatetime.toLocaleString(), displayRow: true },
            { term: 'End date', details: programSchedule.endDatetime.toLocaleString(), displayRow: true },
            { term: 'Topic', details: programSchedule.topic ?? '(Not set)', displayRow: true },
          ]} 
        />
      </div>

      <FormCheckboxField id="confirm" name="confirm" label="Confirm you want to delete this schedule" />
      
    </ButtonForm>
  );
}
