'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { ProgramScheduleEntity, UserEntity } from '@/models/entity';
import { PaginatedListDto } from '@/models/dto';
import ButtonForm from '@/components/button-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import FormInputField from '@/components/form-input-field';
import FormSelectField from '@/components/form-select-field';
import SimpleDescriptionList from '@/components/simple-description-list';

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

      <GenericTable
        headings={[ 'Select', 'ID', 'Name', 'Email', 'Phone', 'Membership' ]}
        items={users.data}
        renderItem={(user) => (
          <tr key={user.id}>
            <td className="p-2 border">
              <input 
                type="radio" 
                name="userId" 
                value={user.id} 
                defaultChecked={user.id === state.values.userId} 
                className="w-6 h-6" 
                required 
              />
            </td>
            <td className="p-2 border">{ user.id }</td>
            <td className="p-2 border">{ user.firstName } { user.lastName }</td>
            <td className="p-2 border">{ user.emailAddress ?? '(not set)' }</td>
            <td className="p-2 border">{ user.phoneNumber ?? '(not set)' }</td>
            <td className="p-2 border">{ user.membershipNumber ?? '(not set)' }</td>
          </tr>
        )}
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
