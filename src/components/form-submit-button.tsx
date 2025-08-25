'use client'

import RotatingProgressBar from './rotating-progress-bar';

export default function FormSubmitButton({ text, loading = false }: Readonly<{ text: string; loading?: boolean; }>) {
  return (
    <button className="block w-full p-2 text-white bg-primary border border-primary hover:bg-primary-variant disabled:bg-gray-400">
      { loading ?  <RotatingProgressBar /> : <span>{ text }</span> }
    </button>
  );
}
