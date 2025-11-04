import React from 'react';

export type FormRadioButton = { value: string | number; label?: string | React.ReactNode; };

export default function FormRadioButtonsGroup(
  { 
    name,
    error,
    value,
    buttons,
    required = true,
    disabled = false,
  }: { 
    name: string; 
    value?: string | number; 
    error?: string | null; 
    required?: boolean; 
    disabled?: boolean; 
    buttons: FormRadioButton[];
  }
) {
  return (
    <div className="mb-4">
      {
        buttons.map((button) => (
          <div key={button.value} className="mb-4 p-2 flex gap-2 items-center border border-primary">
            <input 
              id={`${button.value}-radio-button-input`}
              type="radio" 
              name={name} 
              required={required}
              disabled={disabled}
              value={button.value} 
              defaultChecked={button.value === value} 
              className="w-6 h-6" 
            />

            <label htmlFor={`${button.value}-radio-button-input`} className="flex-grow">{ button.label ?? button.value }</label>
          </div>
        ))
      }

      { error && <span className="block text-sm text-red-600">{ error }</span> }
    </div>
  );
}
