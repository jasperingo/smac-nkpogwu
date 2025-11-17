import { TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <>
      <header className="bg-foreground border-b"> 
        <Link href="/" className="container mx-auto p-4 flex gap-2 items-center justify-center">
          <Image 
            width="20" 
            height="20" 
            className="w-10 h-10"
            alt="Logo iamge"
            src="/images/logo.png"
          />

          <h1 className="font-bold text-primary text-xl md:text-3xl">
            <span>ST Matthew's Anglican Church</span>
            <span className="hidden md:inline"> (Nkpogwu Deanery)</span>
          </h1>
        </Link>
      </header>
    
      <main className="my-8 py-8 px-4 container mx-auto text-center bg-foreground">
        <TriangleAlert className="inline-block" size={40} />

        <p className="font-bold my-4 text-xl">Oops!!! The Page you are looking for was not found</p>

        <p className="my-4">No worries, you can return to our home page by clicking on the link below</p>

        <Link 
          href="/"
          className="inline-block py-1 px-4 text-on-primary bg-primary border border-primary hover:bg-primary-variant" 
        >Home</Link>
      </main>
    </>
  );
}
