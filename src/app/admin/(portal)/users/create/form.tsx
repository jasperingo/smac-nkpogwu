'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { userConstraints } from '@/models/constraints';
import { getYesterdayDateString } from '@/utils/datetime';
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
    dateOfBirth: string;
    membershipNumber: string;
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
      dateOfBirth: string | null;
      membershipNumber: string | null;
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
    password: '',
    dateOfBirth: '',
    membershipNumber: '',
  },
  errors: { 
    message: null, 
    fields: { 
      firstName: null, 
      lastName: null, 
      otherName: null, 
      emailAddress: null, 
      phoneNumber: null, 
      password: null,
      dateOfBirth: null,
      membershipNumber: null,
    } 
  },
};

export default function AdminCreateUserForm({ action }: { action: (state: FormState, formData: FormData) => Promise<FormState>; }) {
  const dateOfBirthMax = getYesterdayDateString();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  return (
    <form action={formAction} className="px-2 py-8 border border-black md:w-96 md:mx-auto">
      <fieldset disabled={isPending}>

        <FormInputField 
          id="first-name" 
          name="firstName" 
          label="First name" 
          value={state.values.firstName} 
          error={state.errors.fields.firstName} 
        />

        <FormInputField 
          id="last-name" 
          name="lastName" 
          label="Last name" 
          value={state.values.lastName} 
          error={state.errors.fields.lastName} 
        />

        <FormInputField 
          id="other-name" 
          name="otherName" 
          label="Other name" 
          required={false} 
          value={state.values.otherName} 
          error={state.errors.fields.otherName} 
        />

        <FormInputField 
          id="email-address" 
          name="emailAddress" 
          label="Email address" 
          type="email" 
          required={false} 
          value={state.values.emailAddress} 
          error={state.errors.fields.emailAddress} 
        />

        <FormInputField 
          id="phone-number" 
          name="phoneNumber" 
          label="Phone number" 
          type="tel" 
          min={userConstraints.phoneNumberLength}
          max={userConstraints.phoneNumberLength}
          required={false} 
          value={state.values.phoneNumber} 
          error={state.errors.fields.phoneNumber} 
        />

        <FormInputField 
          id="password" 
          name="password" 
          label="Password" 
          type="password" 
          min={userConstraints.passwordMin}
          max={userConstraints.passwordMax}
          required={false} 
          value={state.values.password} 
          error={state.errors.fields.password} 
        />

        <FormInputField 
          id="date-of-birth" 
          name="dateOfBirth" 
          label="Date of birth" 
          type="date" 
          max={dateOfBirthMax}
          required={false} 
          value={state.values.dateOfBirth} 
          error={state.errors.fields.dateOfBirth} 
        />

        <FormInputField 
          id="membership-number" 
          name="membershipNumber" 
          label="Membership number" 
          type="number" 
          required={false} 
          value={state.values.membershipNumber} 
          error={state.errors.fields.membershipNumber} 
        />

        <FormSubmitButton text="Create user" loading={isPending} />

      </fieldset>
    </form>
  );
}
