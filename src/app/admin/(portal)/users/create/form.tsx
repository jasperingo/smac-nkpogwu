'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { UserEntityGender } from '@/models/entity';
import { userConstraints } from '@/models/constraints';
import { getYesterdayDateString } from '@/utils/datetime';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormSelectField from '@/components/form-select-field';

export type FormState = { 
  values: { 
    firstName: string; 
    lastName: string;
    otherName: string;
    gender: string;
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
      gender: string | null; 
      emailAddress: string | null; 
      phoneNumber: string | null; 
      password: string | null; 
      dateOfBirth: string | null;
      membershipNumber: string | null;
    }; 
  };
};

export const initialState: FormState = { 
  values: { 
    firstName: '', 
    lastName: '', 
    otherName: '', 
    gender: '', 
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
      gender: null, 
      emailAddress: null, 
      phoneNumber: null, 
      password: null,
      dateOfBirth: null,
      membershipNumber: null,
    },
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
    <ButtonForm text="Create user" isPending={isPending} action={formAction}>

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

      <FormSelectField 
        id="gender" 
        name="gender" 
        label="Gender" 
        options={UserEntityGender.map((g) => ({ value: g }))}
        value={state.values.gender} 
        error={state.errors.fields.gender} 
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
        minLength={userConstraints.phoneNumberLength}
        maxLength={userConstraints.phoneNumberLength}
        required={false} 
        value={state.values.phoneNumber} 
        error={state.errors.fields.phoneNumber} 
      />

      <FormInputField 
        id="password" 
        name="password" 
        label="Password" 
        type="password" 
        minLength={userConstraints.passwordMin}
        maxLength={userConstraints.passwordMax}
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

    </ButtonForm>
  );
}
