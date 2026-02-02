import { Funnel } from 'lucide-react';
import { HTMLInputTypeAttribute, ReactElement } from 'react';
import { FormSelectFieldOption } from './form-select-field';

type FilterFormInputField = {
  type: 'input';
  input: HTMLInputTypeAttribute;
};

type FilterFormSelectField = {
  type: 'select';
  options: FormSelectFieldOption[];
};

export type FilterFormField = {
  id: string;
  name: string;
  label?: string;
  value?: string;
  placeholder?: string;
} & (
  FilterFormInputField | FilterFormSelectField
);

export default function FilterForm(
  { fields, action, extraParams }: { fields: FilterFormField[]; action: string; extraParams?: Map<string, string | undefined> }
) {
  const extraInputs: ReactElement[] = [];

  if (extraParams) {
    for (const [key, value] of extraParams.entries()) {
      extraInputs.push(<input key={key} type="hidden" name={key} defaultValue={value} />);
    }
  }

  return (
    <form action={action} className="my-4 flex-grow">
      { extraInputs }
      
      {
        fields.map((field) => (
          <div key={field.id} className="mb-4">
            {
              field.label !== undefined && <label htmlFor={`${field.id}-input`} className="block text-sm">{ field.label }</label>
            }

            {
              field.type === 'input' && (
                <input 
                  id={`${field.id}-input`} 
                  type={field.input} 
                  name={field.name}
                  defaultValue={field.value}
                  placeholder={field.placeholder}
                  className="inline-block w-full p-2 border border-primary outline-0" 
                />
              )
            }

            {
              field.type === 'select' && (
                <select 
                  name={field.name} 
                  id={`${field.id}-input`} 
                  defaultValue={field.value}
                  className="inline-block w-full p-2 border border-primary outline-0"
                >
                  <option value="">{ field.placeholder }</option>

                  {
                    field.options.map((option) => <option key={option.value} value={option.value}>{ option.text ?? option.value }</option>)
                  }
                </select>
              )
            }
          </div>
        ))
      }

      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 flex gap-2 items-center text-on-primary bg-primary hover:bg-primary-variant">
          <Funnel />
          <span>Filter</span>
        </button>
      </div>
    </form>
  );
}
