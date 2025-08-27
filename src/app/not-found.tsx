import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <header className="bg-foreground border-b"> 
        <div className="container mx-auto p-4 flex gap-4 items-center">
          <div className="w-8 h-8 bg-orange-500"></div>
          <h1 className="font-bold text-primary text-xl sm:hidden">SMAC</h1>
          <h1 className="font-bold text-primary text-xl hidden sm:block md:text-3xl">ST Matthew's Anglican Church</h1>
        </div>
      </header>
    
      <main className="my-8 py-8 px-4 container mx-auto text-center bg-foreground">
        <TriangleAlert className="inline-block" size={40} />

        <p className="font-bold my-4">Oops!!! The Page you are looking for was not found</p>

        <Link 
          href="/"
          className="inline-block py-2 px-4 text-on-primary bg-primary border border-primary hover:bg-primary-variant" 
        >Main website</Link>
      </main>
    </>
  );
}
