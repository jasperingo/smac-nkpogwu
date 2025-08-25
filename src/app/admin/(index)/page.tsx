import FormField from '@/components/form-field';
import FormFieldset from '@/components/form-fieldset';

export async function adminSignIn(formData: FormData) {
  'use server'

  const identifier = formData.get('identifier');
  const password = formData.get('password');
 
  console.log('Admin sign in submitted: ID = ', identifier, ' & password = ', password);

  await new Promise((resolve) => setTimeout(resolve, 2000));
}

export default async function AdminIndexPage() {

  return (
    <form action={adminSignIn} className="my-20 px-2 py-8 border border-black bg-foreground md:w-96 md:mx-auto">
      <FormFieldset buttonText="Admin sign in">

        <FormField id="identifier" name="identifier" label="Email address or Phone number" error={null} />

        <FormField type="password" id="password" name="password" label="Password" error={null} />

      </FormFieldset>
    </form>
  );
}
