'use client'

import { useActionState } from 'react';
import FormSubmitButton from '@/components/form-submit-button';
import FormCheckboxField from '@/components/form-checkbox-field';

export default function AdminSignOutForm({ action }: { action: (state: any, formData: FormData) => Promise<any>; }) {
  const [state, formAction, isPending] = useActionState<any, FormData>(action, null);

  return (
    <form action={formAction} className="p-2 border border-black">
      <fieldset disabled={isPending}>

        <FormCheckboxField id="confirm" name="signout" label="Confirm you want to sign out" />

        <FormSubmitButton text="Sign out" loading={isPending} positive={false} />

      </fieldset>
    </form>
  );
}
