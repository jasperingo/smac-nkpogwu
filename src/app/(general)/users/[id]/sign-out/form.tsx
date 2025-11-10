'use client'

import { useActionState } from 'react';
import ButtonForm from '@/components/button-form';
import FormCheckboxField from '@/components/form-checkbox-field';

export default function UserSignOutForm({ action }: { action: (state: any, formData: FormData) => Promise<any>; }) {
  const [state, formAction, isPending] = useActionState<any, FormData>(action, null);

  return (
    <ButtonForm text="Sign out" positive={false} isPending={isPending} action={formAction}>

      <FormCheckboxField id="confirm" name="signout" label="Confirm you want to sign out" />

    </ButtonForm>
  );
}
