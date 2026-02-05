import z from 'zod';
import { storeImageToDisk } from '@/utils/storage';
import { UserDefaultImage } from '@/models/entity';
import { findUserById, updateUser } from '@/services/user-service';
import { imageFileValidation } from '@/validations/images-validation';
import ImageUploadForm, { FormState } from '@/components/image-upload-form';

async function userImageUpload(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const userId = Number(formData.get('userId'));
  const image = formData.get('image') as File;

  const validatedResult = imageFileValidation.safeParse(image);
  
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

  if (isNaN(id)) {
    return null;
  }
  
  const user = await findUserById(id);

  if (user === null) {
    return null;
  }

  return (
    <section className="bg-foreground p-4">

     <ImageUploadForm ownerId={user.id} ownerInput="userId" currentImage={user.imageUrl ?? UserDefaultImage} action={userImageUpload} />
     
    </section>
  );
}
