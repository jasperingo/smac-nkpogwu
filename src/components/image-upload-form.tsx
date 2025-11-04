'use client'

import Image from 'next/image';
import { ChangeEvent, useActionState, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import ButtonForm from '@/components/button-form';

export type FormState = { 
  success: boolean;
  error: string | null;
};

export const initialState: FormState = { 
  success: false,
  error: null, 
};

export default function ImageUploadForm(
  { 
    ownerId,
    ownerInput,
    currentImage,
    action 
  }: { 
    ownerId: number,
    ownerInput: string,
    currentImage: string,
    action: (state: FormState, formData: FormData) => Promise<FormState>; 
  }
) {
  const [imageUrl, setImageUrl] = useState(currentImage);

  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast('Image uploaded', { type: 'success' });
    } else if (state.error) {
      toast(state.error, { type: 'error' });
    } 
  }, [state]);

  const handleFileChange = (event: ChangeEvent) => {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setImageUrl(e.target!.result as string);
      };

      reader.onerror = (e) => {
        console.error('Error reading file: ', e);

        toast('Error reading selected image', { type: 'error' });
      };

      reader.readAsDataURL(input.files[0]);
    } else {
      setImageUrl(currentImage);
    }
  };

  return (
    <ButtonForm text="Upload image" isPending={isPending} responsiveness="none" action={formAction}>
      <input type="hidden" name={ownerInput} defaultValue={ownerId} />

      <Image 
        width="64" 
        height="64" 
        alt={`${ownerId} image`} 
        src={imageUrl} 
        className="block mx-auto mb-2 border border-gray-400 rounded-full md:w-24 md:h-24" 
      />

      <input 
        type="file" 
        name="image" 
        accept="image/*" 
        required 
        className="mb-4 inline-block w-full p-2 border border-primary outline-0 disabled:bg-gray-300 user-invalid:border-red-600" 
        onChange={handleFileChange}
      />
    </ButtonForm>
  );
}
