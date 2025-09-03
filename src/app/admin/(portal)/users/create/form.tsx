'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import FormInputField from '@/components/form-input-field';
import FormSubmitButton from '@/components/form-submit-button';

export type FormState = { 
  values: { 
    firstName: string; 
    lastName: string;
    otherName: string;
    emailAddress: string; 
    phoneNumber: string; 
    password: string;
  };
  errors: { 
    message: string | null; 
    fields: { 
      firstName: string | null; 
      lastName: string | null; 
      otherName: string | null; 
      emailAddress: string | null; 
      phoneNumber: string | null; 
      password: string | null; 
    }; 
  };
};

const initialState: FormState = { 
  values: { 
    firstName: '', 
    lastName: '', 
    otherName: '', 
    emailAddress: '', 
    phoneNumber: '', 
    password: '' 
  },
  errors: { 
    message: null, 
    fields: { 
      firstName: null, 
      lastName: null, 
      otherName: null, 
      emailAddress: null, 
      phoneNumber: null, 
      password: null 
    } 
  },
};

export default function AdminCreateUserForm({ action }: { action: (state: FormState, formData: FormData) => Promise<FormState>; }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  return (
    <form action={formAction} className="px-2 py-8 border border-black">
      <fieldset disabled={isPending}>

        <FormInputField id="first-name" name="firstName" label="First name" value={state.values.firstName} error={state.errors.fields.firstName} />

        <FormInputField id="last-name" name="lastName" label="Last name" value={state.values.lastName} error={state.errors.fields.lastName} />

        <FormInputField id="other-name" name="otherName" label="Other name" value={state.values.otherName} error={state.errors.fields.otherName} />

        <FormInputField id="email-address" name="emailAddress" label="Email address" value={state.values.emailAddress} error={state.errors.fields.emailAddress} />

        <FormInputField id="phone-number" name="phoneNumber" label="Phone number" value={state.values.phoneNumber} error={state.errors.fields.phoneNumber} />

        <FormInputField type="password" id="password" name="password" label="Password" value={state.values.password} error={state.errors.fields.password} />

        <FormSubmitButton text="Create user" loading={isPending} />

      </fieldset>
    </form>
  );
}
