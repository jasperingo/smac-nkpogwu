import z from 'zod';
import { storeImageToDisk } from '@/utils/storage';
import { GroupDefaultImage } from '@/models/entity';
import { findGroupById, updateGroup } from '@/services/group-service';
import { imageFileValidation } from '@/validations/images-validation';
import ImageUploadForm, { FormState } from '@/components/image-upload-form';

export async function groupImageUpload(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const groupId = Number(formData.get('groupId'));
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
    const fileUrl = await storeImageToDisk(image, 'group', groupId);

    const group = await updateGroup(groupId, { imageUrl: fileUrl });
  
    if (group === null) {
      throw new Error('Update group image return value is null');
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error uploading group image: ', error);

    return { 
      success: false,
      error: error instanceof Error ? error.message : error as string,
    };
  }
}

export default async function AdminGroupUploadImagePage({ params }: { params: Promise<{ id: string }>;  }) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return null;
  }
  
  const group = await findGroupById(id);

  if (group === null) {
    return null;
  }

  return (
    <section className="bg-foreground p-4">

     <ImageUploadForm ownerId={group.id} ownerInput="groupId" currentImage={group.imageUrl ?? GroupDefaultImage} action={groupImageUpload} />

    </section>
  );
}
