import z from 'zod';
import { storeImageToDisk } from '@/utils/storage';
import AdminUploadUserImageForm, { FormState } from './form';
import { findUserById, updateUser } from '@/services/user-service';

const validationSchema = z.file()
  .max(10_000_000, 'The size of the provided file is too large') // 10mb
  .refine((value) => value.type.startsWith('image/'), 'The provided file is not an image') 

export async function userImageUpload(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const userId = Number(formData.get('userId'));
  const image = formData.get('image') as File;

  const validatedResult = validationSchema.safeParse(image);
  
  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      success: false,
      error: errors.formErrors?.[0] ?? null,
    };
  }
  
  try {
    const fileUrl = await storeImageToDisk(image, 'user', userId);

    const user = await updateUser(userId, { imageUrl: fileUrl });
  
    if (user === null) {
      throw new Error('Update user image return value is null');
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error uploading user image: ', error);

    return { 
      success: false,
      error: error instanceof Error ? error.message : error as string,
    };
  }
}

export default async function AdminUserUploadImagePage({ params }: { params: Promise<{ id: string }>;  }) {
  const id = Number((await params).id);

  const user = (await findUserById(id))!;

  return (
    <section className="bg-foreground p-4">

     <AdminUploadUserImageForm user={user} action={userImageUpload} />

    </section>
  );
}
