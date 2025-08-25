'use client'

import { useFormStatus } from 'react-dom';
import RotatingProgressBar from './rotating-progress-bar';

export default function FormFieldset({ children, buttonText = null }: Readonly<{ children: React.ReactNode; buttonText?: string | null; }>) {
   const status = useFormStatus();

  return (
    <fieldset disabled={status.pending}>
      {children}

      {
        buttonText &&
        <button className="block w-full p-2 text-white bg-primary border border-primary hover:bg-primary-variant disabled:bg-gray-400">
          { status.pending ?  <RotatingProgressBar /> : buttonText }
        </button>
      }
    </fieldset>
  );
}
