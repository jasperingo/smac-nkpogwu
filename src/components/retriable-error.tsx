'use client'

import { useEffect } from 'react';

export default function RetriableError({ error, reset }: { error: Error & { digest?: string }; reset: () => void; }) {
  useEffect(() => console.error(error), [error]);
 
  return (
    <div className="p-4 bg-foreground text-center">
      <p className="mb-4 font-bold text-xl">An error occurred</p>

      <p className="mb-4">{ error.message }</p>

      <button 
        className="py-2 px-4 text-on-primary bg-primary border border-primary hover:bg-primary-variant" 
        onClick={() => reset()}
      >Try again</button>
    </div>
  );
}
