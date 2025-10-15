'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { GroupEntity, UserEntity } from '@/models/entity';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormTextAreaField from '@/components/form-textarea-field';
import SimpleDescriptionList from '@/components/simple-description-list';

export type FormState = { 
  values: { 
    name: string; 
    theme: string;
    topic: string; 
    description: string;
  };
  errors: { 
    message: string | null; 
    fields: { 
      name: string | null; 
      theme: string | null; 
      topic: string | null;
      description: string | null; 
    }; 
  };
};

export const initialState: FormState = { 
  values: { 
    name: '', 
    theme: '', 
    topic: '', 
    description: '',
  },
  errors: {
    message: null, 
    fields: { 
      name: null, 
      theme: null, 
      topic: null,
      description: null, 
    },
  },
};

export default function AdminCreateProgramForm(
  { 
    user,
    group, 
    action
  }: { 
    user: UserEntity | null; 
    group: GroupEntity | null; 
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
    <ButtonForm text="Create program" isPending={isPending} action={formAction}>
      {
        user !== null && (
          <>
            <div className="mb-4 border p-2 col-span-full">
              <SimpleDescriptionList
                caption="User"
                items={[
                  { term: 'ID', details: user.id, displayRow: true },
                  { term: 'First name', details: user.firstName, displayRow: true },
                  { term: 'Last name', details: user.lastName, displayRow: true },
                  { term: 'Email', details: user.emailAddress ?? '(Not set)', displayRow: true },
                  { term: 'Phone', details: user.phoneNumber ?? '(Not set)', displayRow: true },
                  { term: 'Membership', details: user.membershipNumber ?? '(Not set)', displayRow: true },
                ]} 
              />
            </div>

            <input type="hidden" name="userId" defaultValue={user.id} />
          </>
        )
      }

      {
        group !== null && (
          <>
            <div className="mb-4 border p-2 col-span-full">
              <SimpleDescriptionList
                caption="Group"
                items={[
                  { term: 'ID', details: group.id, displayRow: true },
                  { term: 'Name', details: group.name, displayRow: true },
                  { term: 'Privacy', details: group.privacy, displayRow: true },
                ]} 
              />
            </div>

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
        id="theme" 
        name="theme" 
        label="Theme" 
        required={false}
        value={state.values.theme} 
        error={state.errors.fields.theme} 
      />

      <FormInputField 
        id="topic" 
        name="topic" 
        label="Topic" 
        required={false}
        value={state.values.topic} 
        error={state.errors.fields.topic} 
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
