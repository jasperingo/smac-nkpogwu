'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { GroupEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormTextAreaField from '@/components/form-textarea-field';
import SimpleDescriptionList from '@/components/simple-description-list';
import BooleanFormSelectField from '@/components/boolean-form-select-field';

export type FormState = { 
  values: { 
    name: string; 
    priority: string; 
    description: string;
    contactable: string; 
  };
  errors: { 
    message: string | null; 
    fields: { 
      name: string | null; 
      priority: string | null; 
      description: string | null; 
      contactable: string | null;
    }; 
  };
};

export const initialState: FormState = {
  errors: { 
    message: null, 
    fields: { 
      name: null,
      priority: null,
      description: null, 
      contactable: null,
    } 
  },
  values: { 
    name: '', 
    priority: '', 
    description: '',
    contactable: 'false', 
  },
};

export default function AdminCreateRoleForm(
  { group, action }: { group: GroupEntity | null; action: (state: FormState, formData: FormData) => Promise<FormState>; }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  return (
    <ButtonForm text="Create role" isPending={isPending} action={formAction}>
      {
        group !== null && (
          <>
            <SimpleDescriptionList
              insideForm
              caption="Group"
              items={[
                { term: 'ID', details: group.id, displayRow: true },
                { term: 'Name', details: group.name, displayRow: true },
                { term: 'Privacy', details: group.privacy, displayRow: true },
                { term: 'Spotlighted', details: group.spotlighted ? 'Yes' : 'No', displayRow: true },
              ]} 
            />

            <input type="hidden" name="groupId" defaultValue={group.id} />
          </>
        )
      }

      <FormInputField 
        id="name" 
        name="name" 
        label="Name" 
        value={state.values.name} 
        error={state.errors.fields.name} 
      />

      <FormInputField 
        id="priority" 
        type="number"
        name="priority" 
        label="Priority" 
        min={1}
        step={1}
        value={state.values.priority} 
        error={state.errors.fields.priority} 
      />

      <BooleanFormSelectField 
        id="contactable" 
        name="contactable" 
        label="Is contact"
        value={state.values.contactable} 
        error={state.errors.fields.contactable} 
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
