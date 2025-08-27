'use client'

import RotatingProgressBar from './rotating-progress-bar';

export default function FormSubmitButton({ text, loading = false, positive = true }: Readonly<{ text: string; loading?: boolean; positive?: boolean; }>) {
  return (
    <button className={`block w-full p-2 text-white border disabled:bg-gray-400 
      ${positive ? 'bg-primary border-primary hover:bg-primary-variant' : 'bg-red-700 border-red-700 hover:bg-red-600'}`}>
      { loading ?  <RotatingProgressBar /> : <span>{ text }</span> }
    </button>
  );
}
