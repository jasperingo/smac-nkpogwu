'use client'

import { useActionState, useEffect } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { toast } from 'react-toastify';
import { UserEntityGender } from '@/models/entity';
import { userConstraints } from '@/models/constraints';
import { getYesterdayDateString } from '@/utils/datetime';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormSelectField from '@/components/form-select-field';

export type FormState = { 
  success: boolean;
  values: { 
    title: string; 
    firstName: string; 
    lastName: string;
    otherName: string;
    gender: string;
    emailAddress: string; 
    phoneNumber: string;
    dateOfBirth: string;
    membershipNumber: string;
    membershipStartDatetime: string;
  };
  errors: { 
    message: string | null; 
    fields: { 
      title: string | null; 
      firstName: string | null; 
      lastName: string | null; 
      otherName: string | null; 
      gender: string | null; 
      emailAddress: string | null; 
      phoneNumber: string | null;
      dateOfBirth: string | null;
      membershipNumber: string | null;
      membershipStartDatetime: string | null;
    }; 
  };
};

export const initialState: FormState = { 
  success: false,
  values: { 
    title: '', 
    firstName: '', 
    lastName: '', 
    otherName: '', 
    gender: '', 
    emailAddress: '', 
    phoneNumber: '', 
    dateOfBirth: '',
    membershipNumber: '',
    membershipStartDatetime: '',
  },
  errors: { 
    message: null, 
    fields: { 
      title: null, 
      firstName: null, 
      lastName: null, 
      otherName: null, 
      gender: null, 
      emailAddress: null, 
      phoneNumber: null, 
      dateOfBirth: null,
      membershipNumber: null,
      membershipStartDatetime: null,
    },
  },
};

export default function SignUpForm({ action }: { action: (state: FormState, formData: FormData) => Promise<FormState>; }) {
  const dateOfBirthMax = getYesterdayDateString();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    }
  }, [state]);

  if (state.success) {
    return (
      <div className="text-center">
        <Heart className="w-16 h-16 block mx-auto md:w-24 md:h-24" fill='red' stroke='red' />
        <div>Thank you for your interest in joining this family of God.</div>
        <div>Your request is under review and you will be informed as soon as we have feedback for you.</div>
        <div>You can always reach out to our <Link href="/contacts" className="text-primary">contacts</Link> for more enquiry. </div>
        <div>Jesus loves you.</div>
      </div>
    );
  }

  return (
    <ButtonForm text="Join Us" isPending={isPending} action={formAction}>

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
        id="title" 
        name="title" 
        label="Title" 
        required={false}
        value={state.values.title} 
        error={state.errors.fields.title} 
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

      <FormInputField 
        id="Membership-start-date" 
        name="membershipStartDatetime" 
        label="Membership start date" 
        type="date" 
        required={false} 
        value={state.values.membershipStartDatetime} 
        error={state.errors.fields.membershipStartDatetime} 
      />
    </ButtonForm>
  );
}
