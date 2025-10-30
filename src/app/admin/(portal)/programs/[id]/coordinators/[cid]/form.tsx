'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProgramCoordinatorEntity, UserEntity } from '@/models/entity';
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

export default function AdminDeleteProgramCoordinatorForm(
  { 
    programId,
    programCoordinator,
    programCoordinatorUser,
    action
  }: { 
    programId: number;
    programCoordinatorUser: UserEntity | null;
    programCoordinator: ProgramCoordinatorEntity;
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
    <ButtonForm text="Delete coordinator" positive={false} isPending={isPending} action={formAction}>
      <input type="hidden" name="programId" defaultValue={programId} />
      
      <input type="hidden" name="programCoordinatorId" defaultValue={programCoordinator.id} />

      <input type="hidden" name="programScheduleId" defaultValue={programCoordinator.programScheduleId} />

      <div className="mb-4 border p-2 col-span-full">
        <SimpleDescriptionList
          items={[
            { term: 'ID', details: programCoordinator.id, displayRow: true },
            { term: 'Role', details: programCoordinator.role, displayRow: true },
            { term: 'Is Guest', details: programCoordinatorUser === null ? 'No' : 'Yes', displayRow: true },
            { 
              term: 'Name', 
              displayRow: true,
              details: programCoordinator.name ?? (programCoordinatorUser ? `${programCoordinatorUser.firstName} ${programCoordinatorUser.lastName}` : ''), 
            },
          ]} 
        />
      </div>

      <FormCheckboxField id="confirm" name="confirm" label="Confirm you want to delete this coordinator" />
      
    </ButtonForm>
  );
}
