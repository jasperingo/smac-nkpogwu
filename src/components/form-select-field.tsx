export type FormSelectFieldOption = { value: string; text?: string; };

// There is a React bug with select retaining old value after form submission

export default function FormSelectField(
  { 
    id, 
    name, 
    label, 
    error,
    value,
    options,
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
    options: FormSelectFieldOption[];
  }
) {
  return (
    <div className="mb-4">
      <label htmlFor={`${id}-input`} className="block text-sm">
        <span>{ label }</span>
        { !required && <span className="text-xs"> (Optional)</span> }
      </label>

      <select 
        name={name} 
        id={`${id}-input`} 
        defaultValue={value}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`inline-block w-full p-2 border border-primary outline-0 disabled:bg-gray-300 user-invalid:border-red-600 ${error && 'border-red-600'}`}
      >
        <option value="">{ placeholder }</option>

        {
          options.map((option) => <option key={option.value} value={option.value}>{ option.text ?? option.value }</option>)
        }
      </select>

        
      { error && <span className="block text-sm text-red-600">{ error }</span> }
    </div>
  );
}
