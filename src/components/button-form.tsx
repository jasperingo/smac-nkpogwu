'use client'

import FormSubmitButton from './form-submit-button';

export default function ButtonForm(
  { 
    text, 
    isPending, 
    children,
    responsiveness = 'grid',
    action 
  }: { 
    text: string; 
    isPending: boolean; 
    children: React.ReactNode;
    responsiveness?: 'none' | 'grid';
    action: (formData: FormData) => Promise<void> | void | undefined; 
  }
) {
  return (
    <form action={action} className="px-2 py-8 border border-black">
      <fieldset disabled={isPending}>

        <div className={responsiveness === 'grid' ? 'md:grid md:gap-x-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4' : ''}>
          { children }
        </div>

        <FormSubmitButton text={text} loading={isPending} />

      </fieldset>
    </form>
  );
}
