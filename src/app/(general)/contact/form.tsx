'use client'

import { useFormStatus } from 'react-dom';

export default function FormFieldSet() {
  const status = useFormStatus();

  return (
    <fieldset disabled={status.pending}>
      <input type="text" name="name" className="border" />
      <button type="submit" className="border">{ status.pending ? 'Loading...' : 'Create'}</button>
    </fieldset>
  );
}
