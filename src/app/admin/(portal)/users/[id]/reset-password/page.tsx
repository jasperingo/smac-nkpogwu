import { redirect } from 'next/navigation';
import AdminResetUserPasswordForm, { FormState } from './form';
import { findUserById, updateUser } from '@/services/user-service';

export async function userResetPassword(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const userId = Number(formData.get('userId'));
  
  try {
    const user = await updateUser(userId, { password: process.env.USER_DEFAULT_PASSWORD! });
  
    if (user === null) {
      throw new Error('Update user password return value is null');
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating user password: ', error);

    return { 
      success: false,
      error: error instanceof Error ? error.message : error as string,
    };
  }
}

export default async function AdminUserResetPasswordPage({ params }: { params: Promise<{ id: string }>;  }) {
  const id = Number((await params).id);

  const user = (await findUserById(id))!;

  if (user.emailAddress === null && user.phoneNumber === null) {
    redirect(`/admin/users/${id}`);
  }

  return (
    <section className="bg-foreground p-4">

     <AdminResetUserPasswordForm userId={id} action={userResetPassword} />
     
    </section>
  );
}
