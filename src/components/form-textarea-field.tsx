'use client'

export default function FormTextAreaField(
  { 
    id, 
    name, 
    label, 
    error,
    value,
    autoComplete,
    placeholder = '',
    required = true,
    minLength,
    maxLength,
  }: { 
    id: string;
    name: string; 
    label: string; 
    value?: string | number; 
    error?: string | null; 
    required?: boolean; 
    placeholder?: string; 
    autoComplete?: string; 
    minLength?: number; 
    maxLength?: number; 
  }
) {
  return (
    <div className="mb-4">
      <label htmlFor={`${id}-input`} className="block text-sm">
        <span>{ label }</span>
        { !required && <span className="text-xs"> (Optional)</span> }
      </label>

      <textarea 
        name={name} 
        id={`${id}-input`} 
        rows={3}
        minLength={minLength}
        maxLength={maxLength}
        defaultValue={value}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`inline-block w-full p-2 resize-y border border-primary outline-0 disabled:bg-gray-300 user-invalid:border-red-600 ${error && 'border-red-600'}`}
      ></textarea>

      { error && <span className="block text-sm text-red-600">{ error }</span> }
    </div>
  );
}
