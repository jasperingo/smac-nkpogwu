'use client'

import { useActionState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';
import FormInputField from '@/components/form-input-field';
import FormSelectField from '@/components/form-select-field';
import BooleanFormSelectField from '@/components/boolean-form-select-field';
import { userConstraints } from '@/models/constraints';
import { getDateInputString, getYesterdayDateString } from '@/utils/datetime';
import { UserEntity, UserEntityGender, UserEntityStatus } from '@/models/entity';

export type FormState = { 
  success: boolean;
  values: { 
    status: string; 
    title: string; 
    firstName: string; 
    lastName: string;
    otherName: string;
    gender: string;
    isAdministrator: string;
    emailAddress: string; 
    phoneNumber: string; 
    dateOfBirth: string;
    membershipNumber: string;
    membershipStartDatetime: string;
  };
  errors: { 
    message: string | null; 
    fields: { 
      status: string | null; 
      title: string | null; 
      firstName: string | null; 
      lastName: string | null; 
      otherName: string | null; 
      gender: string | null; 
      isAdministrator: string | null; 
      emailAddress: string | null; 
      phoneNumber: string | null; 
      dateOfBirth: string | null;
      membershipNumber: string | null;
      membershipStartDatetime: string | null;
    }; 
  };
};

const initialErrorState: FormState['errors'] = { 
  message: null, 
  fields: { 
    status: null, 
    title: null, 
    firstName: null, 
    lastName: null, 
    otherName: null, 
    gender: null, 
    isAdministrator: null, 
    emailAddress: null, 
    phoneNumber: null, 
    dateOfBirth: null,
    membershipNumber: null,
    membershipStartDatetime: null,
  } 
};

export default function AdminUpdateUserForm({ user, action }: { user: UserEntity; action: (state: FormState, formData: FormData) => Promise<FormState>; }) {
  const dateOfBirthMax = getYesterdayDateString();

  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, { 
    success: false,
    errors: initialErrorState,
    values: { 
      status: user.status, 
      title: user.title ?? '', 
      firstName: user.firstName, 
      lastName: user.lastName, 
      otherName: user.otherName ?? '', 
      gender: user.gender, 
      isAdministrator: user.isAdministrator.toString(), 
      emailAddress: user.emailAddress ?? '', 
      phoneNumber: user.phoneNumber ?? '',
      dateOfBirth: user.dateOfBirth ? getDateInputString(user.dateOfBirth) : '',
      membershipNumber: user.membershipNumber ?? '',
      membershipStartDatetime: user.membershipStartDatetime ? getDateInputString(user.membershipStartDatetime) : '',
    },
  });

  useEffect(() => {
    if (state.success) {
      toast('User details updated', { type: 'success' });
    } else if (state.errors.message) {
      toast(state.errors.message, { type: 'error' });
    } 
  }, [state]);

  return (
    <ButtonForm text="Update user" isPending={isPending} action={formAction}>
      <input type="hidden" name="userId" defaultValue={user.id} />

      <FormSelectField 
        id="status" 
        name="status" 
        label="Status" 
        options={UserEntityStatus.filter((s) => user.status === UserEntityStatus[0] || s !== UserEntityStatus[0]).map((s) => ({ value: s }))}
        value={state.values.status} 
        error={state.errors.fields.status} 
      />

      <FormInputField 
        id="title" 
        name="title" 
        label="Title" 
        required={false}
        value={state.values.title} 
        error={state.errors.fields.title} 
      />

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

      <BooleanFormSelectField 
        id="administrator" 
        name="isAdministrator" 
        label="Is Administrator" 
        value={state.values.isAdministrator} 
        error={state.errors.fields.isAdministrator} 
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
