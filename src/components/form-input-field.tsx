'use client'

import { useState } from 'react';

export default function FormInputField(
  { 
    id, 
    name, 
    label, 
    error,
    value,
    autoComplete,
    placeholder,
    type = 'text',
    required = true,
  }: { 
    id: string;
    name: string; 
    label: string; 
    type?: string; 
    value?: string | number; 
    error?: string | null; 
    required?: boolean; 
    placeholder?: string; 
    autoComplete?: string; 
  }
) {
   const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor={`${id}-input`} className="block text-sm">{ label }</label>

      <input 
        name={name} 
        id={`${id}-input`} 
        defaultValue={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        type={type === 'password' && visible ? 'text' : type} 
        className={`inline-block w-full p-2 border border-primary outline-0 disabled:bg-gray-300 user-invalid:border-red-600 ${error && 'border-red-600'}`}
      />

      {
          type === 'password' &&
          <button type="button" className="-ml-12 hover:bg-gray-300" onClick={() => setVisible(!visible)}>
            {visible ? 'Hide' : 'Show' }
          </button>
        }
        
      { error && <span className="block text-sm text-red-600">{ error }</span> }
    </div>
  );
}
