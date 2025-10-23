'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProgramActivityEntity } from '@/models/entity';
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

export default function AdminDeleteProgramActivityForm(
  { 
    programId,
    programActivity,
    action
  }: { 
    programId: number;
    programActivity: ProgramActivityEntity;
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
      <input type="hidden" name="programId" defaultValue={programId} />
      
      <input type="hidden" name="programActivityId" defaultValue={programActivity.id} />

      <input type="hidden" name="programScheduleId" defaultValue={programActivity.programScheduleId} />

      <div className="mb-4 border p-2 col-span-full">
        <SimpleDescriptionList
          items={[
            { term: 'ID', details: programActivity.id, displayRow: true },
            { term: 'Start date', details: programActivity.name, displayRow: true },
            { term: 'Description', details: programActivity.description ?? '(Not set)', displayRow: true },
          ]} 
        />
      </div>

      <FormCheckboxField id="confirm" name="confirm" label="Confirm you want to delete this activity" />
      
    </ButtonForm>
  );
}
