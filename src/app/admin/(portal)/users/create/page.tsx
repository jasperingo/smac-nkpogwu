import AdminCreateUserForm, { FormState } from './form';

export async function userCreate(state: FormState, formData: FormData): Promise<any> {
  'use server'


}

export default async function AdminCreateUserPage() {

  return (
    <section className="bg-foreground p-4">
      <AdminCreateUserForm action={userCreate} />
    </section>
  );
}
