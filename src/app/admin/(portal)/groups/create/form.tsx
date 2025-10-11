'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormSelectField from '@/components/form-select-field';
import FormTextAreaField from '@/components/form-textarea-field';
import { GroupEntity, GroupEntityPrivacy } from '@/models/entity';

export type FormState = { 
  values: { 
    name: string; 
    privacy: string;
    description: string;
    spotlighted: string; 
  };
  errors: { 
    message: string | null; 
    fields: { 
      name: string | null; 
      privacy: string | null; 
      description: string | null; 
      spotlighted: string | null;
    }; 
  };
};

export const initialErrorState: FormState['errors'] = { 
  message: null, 
  fields: { 
    name: null, 
    privacy: null, 
    description: null, 
    spotlighted: null,
  } 
};

export default function AdminCreateGroupForm(
  { group, action }: { group: GroupEntity | null; action: (state: FormState, formData: FormData) => Promise<FormState>; }
) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, {
    errors: initialErrorState,
    values: { 
      name: '', 
      description: '',
      spotlighted: 'false', 
      privacy: group?.privacy ?? GroupEntityPrivacy[0], 
    },
  });

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  return (
    <ButtonForm text="Create group" isPending={isPending} action={formAction}>
      {
        group !== null && (
          <>
            <div className="mb-4 border p-2 col-span-full">
              <div className="font-bold">Parent Group</div>
              <div>ID: { group.id }</div>
              <div>Name: { group.name }</div>
              <div>Privacy: { group.privacy }</div>
            </div>

            <input type="hidden" name="parentId" defaultValue={group.id} />
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

      <FormSelectField 
        id="privacy" 
        name="privacy" 
        label="Privacy" 
        options={GroupEntityPrivacy.map((value) => ({ value }))}
        value={state.values.privacy} 
        error={state.errors.fields.privacy} 
      />

      <FormSelectField 
        id="spotlighted" 
        name="spotlighted" 
        label="Spotlight" 
        options={[ { value: 'true', text: 'Yes' }, { value: 'false', text: 'No' } ]}
        value={state.values.spotlighted} 
        error={state.errors.fields.spotlighted} 
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
