import z from 'zod';
import { hashCompare } from '@/utils/hash';
import UpdateUserPasswordForm, { FormState } from './form';
import { findUserById, updateUser } from '@/services/user-service';
import { userPasswordValidation } from '@/validations/user-validation';

const validationSchema = z.object({
  userId: z.number(),
  newPassword: userPasswordValidation,
  currentPassword: userPasswordValidation,
})
.refine(async (dto) => {
  const user = await findUserById(dto.userId);

  if (user === null || user.password === null) {
    return false;
  }

  return hashCompare(dto.currentPassword, user.password);
}, {
  path: ['currentPassword'],
  error: 'Password is not correct', 
});

export async function userPasswordUpdate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const userId = Number(formData.get('userId')); // TODO: In v2 check that ID exists
  const newPassword = formData.get('newPassword') as string;
  const currentPassword = formData.get('currentPassword') as string;

  const formStateValues: FormState['values'] = { newPassword, currentPassword };

  const validatedResult = await validationSchema.safeParseAsync({ userId, newPassword, currentPassword });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          newPassword: errors.fieldErrors.newPassword?.[0] ?? null,
          currentPassword: errors.fieldErrors.currentPassword?.[0] ?? null,
        }, 
      },
    };
  }
  
  try {
    const user = await updateUser(userId, { password: newPassword });
  
    if (user === null) {
      throw new Error('Update user (password) return value is null');
    }

    return {
      success: true,
      errors: { 
        message: null, 
        fields: { 
          newPassword: null, 
          currentPassword: null,
        },
      },
      values: {
        newPassword: '',
        currentPassword: '',
      },
    };
  } catch (error) {
    console.error('Error updating user (password): ', error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        fields: {
          newPassword: null, 
          currentPassword: null,
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }
}

export default async function UserUpdatePasswordPage({ params }: Readonly<{ params: Promise<{ id: string; }>; }>) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">
      
      <UpdateUserPasswordForm userId={id} action={userPasswordUpdate} />

    </section>
  );
}
