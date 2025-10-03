import { Search } from 'lucide-react';

export default function SearchForm({ value, placeholder, action }: { value?: string; action: string; placeholder?: string; }) {
  return (
    <form action={action} className="my-4">
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
