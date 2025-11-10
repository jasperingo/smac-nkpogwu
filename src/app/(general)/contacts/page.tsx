import FormFieldSet from './form';

export async function createPost(formData: FormData) {
  'use server'

  const name = formData.get('name');
 
  console.log('Tesitng action: ', name);

  await new Promise((resolve) => setTimeout(resolve, 2000));
}

export default async function Contact() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <>
      <h2>Contact page</h2>

      <form action={createPost}>
        <FormFieldSet />
      </form>
    </>
  );
}
