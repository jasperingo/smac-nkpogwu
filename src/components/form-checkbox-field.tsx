'use client'

export default function FormCheckboxField(
  { 
    id, 
    name, 
    label, 
    error,
    checked,
    required = true,
  }: { 
    id: string;
    name: string; 
    label: string; 
    checked?: boolean; 
    error?: string | null; 
    required?: boolean; 
  }
) {
  return (
    <div className="mb-4">
      <div className="flex gap-2 items-center">
        <input
          name={name} 
          id={`${id}-input`} 
          type="checkbox"
          required={required}
          defaultChecked={checked}
          className="inline-block w-6 h-6 border accent-primary outline-0 disabled:accent-gray-300"
        />

        <label htmlFor={`${id}-input`}>{ label }</label>
      </div>
  
      { error && <span className="block text-sm text-red-600">{ error }</span> }
    </div>
  );
}
