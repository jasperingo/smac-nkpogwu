import { Search } from 'lucide-react';
import { ReactElement } from 'react';

export default function SearchForm(
  { value, placeholder, action, extraParams }: { value?: string; action: string; placeholder?: string; extraParams?: Map<string, string | undefined> }
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
      
      <input 
        type="search" 
        name="search" 
        defaultValue={value}
        placeholder={placeholder}
        className="inline-block w-full p-2 pr-12 outline-0 border border-primary" 
      />

      <button type="submit" className="-ml-16 px-4 py-1 align-middle text-center text-primary bg-foreground hover:bg-gray-300">
        <Search />
        <span className="sr-only">Submit form</span>
      </button>
    </form>
  );
}
