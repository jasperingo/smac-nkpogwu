'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { PaginatedListDto } from '@/models/dto';
import { ProgramScheduleEntity, UserEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import PaginationList from '@/components/pagination-list';
import FormInputField from '@/components/form-input-field';
import FormSelectField from '@/components/form-select-field';
import SimpleDescriptionList from '@/components/simple-description-list';
import FormRadioButtonsGroup from '@/components/form-radio-buttons-group';

export type FormState = {
  values: { 
    userId: number; 
    role: string; 
    spotlighted: string; 
  };
  errors: { 
    message: string | null; 
    fields: {
      role: string | null;
      spotlighted: string | null;
    }; 
  };
};

export const initialState: FormState = { 
  values: {
    userId: 0,
    role: '',
    spotlighted: 'false'
  },
  errors: {
    message: null, 
    fields: { 
      role: null, 
      spotlighted: null,
    } 
  }
};

export default function AdminCreateProgramCoordinatorForm(
  { 
    users, 
    search,
    programSchedule,
    action 
  }: { 
    search?: string; 
    users: PaginatedListDto<UserEntity>; 
    programSchedule: ProgramScheduleEntity;
    action: (state: FormState, formData: FormData) => Promise<FormState>; 
  }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Add program coordinator" isPending={isPending} responsiveness="none" action={formAction}>
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
        id="role" 
        name="role" 
        label="Role" 
        value={state.values.role} 
        error={state.errors.fields.role} 
      />

      <FormSelectField 
        id="spotlighted" 
        name="spotlighted" 
        label="Spotlight" 
        options={[ { value: 'true', text: 'Yes' }, { value: 'false', text: 'No' } ]}
        value={state.values.spotlighted} 
        error={state.errors.fields.spotlighted} 
      />

      <FormRadioButtonsGroup
        name="userId"
        value={state.values.userId}
        buttons={users.data.map((user) => ({ 
          value: user.id, 
          label: (
            <>
              <div>ID: { user.id }</div>
              <div>Name: { user.firstName } { user.lastName }</div>
              <div>Email: { user.emailAddress ?? '(not set)' }</div>
              <div>Phone: { user.phoneNumber ?? '(not set)' }</div>
              <div>Membership: { user.membershipNumber ?? '(not set)' }</div>
            </>
          ) 
        }))}
      />

      <PaginationList 
        pagination={users} 
        path={`/admin/programs/${programSchedule.programId}/coordinators/create`} 
        params={new Map([['search', search], ['sid', programSchedule.id.toString()]])} 
      />
 
      <div className="mb-4"></div>

    </ButtonForm>
  );
}
