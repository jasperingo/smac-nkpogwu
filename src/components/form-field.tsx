'use client'

import { useState } from 'react';

export default function FormField(
  { 
    id, 
    name, 
    label, 
    error,
    autoComplete,
    placeholder,
    type = 'text',
    required = true,
  }: { type?: string; name: string; id: string; label: string; error?: string | null; required?: boolean; placeholder?: string; autoComplete?: string; }
) {
   const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor={`${id}-input`} className="block text-sm">{ label }</label>

      <input 
        name={name} 
        id={`${id}-input`} 
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        type={type === 'password' && visible ? 'text' : type} 
        className="inline-block w-full p-2 border border-primary outline-0 disabled:bg-gray-300" 
      />

      {
          type === 'password' &&
          <button type="button" className="-ml-12 hover:bg-gray-300" onClick={() => setVisible(!visible)}>
            {visible ? 'Hide' : 'Show' }
          </button>
        }
        
      { error && <span className="block text-sm text-red-600">Input error</span> }
    </div>
  );
}
