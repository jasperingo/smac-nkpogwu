'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormSelectField from '@/components/form-select-field';
import { GroupEntity, GroupEntityPrivacy } from '@/models/entity';
import FormTextAreaField from '@/components/form-textarea-field';

export type FormState = { 
  success: boolean;
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

export default function AdminUpdateGroupForm({ group, action }: { group: GroupEntity; action: (state: FormState, formData: FormData) => Promise<FormState>; }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, { 
    success: false,
    errors: initialErrorState,
    values: { 
      name: group.name, 
      privacy: group.privacy, 
      description: group.description ?? '',
      spotlighted: group.spotlighted ? 'true' : 'false', 
    },
  });

  useEffect(() => {
    if (state.success) {
      toast('Group details updated', { type: 'success' });
    } else if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Update group" isPending={isPending} action={formAction}>
      <input type="hidden" name="groupId" defaultValue={group.id} />

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
