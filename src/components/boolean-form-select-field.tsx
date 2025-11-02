import FormSelectField from './form-select-field';

export function booleanSelectionToBoolean(selection: string) {
  return selection === 'true';
}

export default function BooleanFormSelectField(
  { 
    id, 
    name, 
    label, 
    error,
    value,
    autoComplete,
    placeholder = '',
    required = true,
    disabled = false,
  }: { 
    id: string;
    name: string; 
    label: string; 
    value?: string | number; 
    error?: string | null; 
    required?: boolean; 
    disabled?: boolean; 
    placeholder?: string; 
    autoComplete?: string; 
  }
) {
  return (
    <FormSelectField 
      name={name} 
      id={id} 
      label={label}
      value={value}
      required={required}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete={autoComplete}
      error={error}
      options={[ { value: 'true', text: 'Yes' }, { value: 'false', text: 'No' } ]}
    />
  );
}
