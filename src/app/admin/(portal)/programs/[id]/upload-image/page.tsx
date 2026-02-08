import z from 'zod';
import { deleteImageFromDisk, storeImageToDisk } from '@/utils/storage';
import { ProgramDefaultImage } from '@/models/entity';
import { imageFileValidation } from '@/validations/images-validation';
import { findProgramById, updateProgam } from '@/services/program-service';
import ImageUploadForm, { FormState } from '@/components/image-upload-form';

async function programImageUpload(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId'));
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
    const currentProgram = await findProgramById(programId);
    
    if (currentProgram?.imageUrl) {
      await deleteImageFromDisk(currentProgram.imageUrl);
    }

    const fileUrl = await storeImageToDisk(image, 'program', programId);

    const program = await updateProgam(programId, { imageUrl: fileUrl });
  
    if (program === null) {
      throw new Error('Update program image return value is null');
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error uploading program image: ', error);

    return { 
      success: false,
      error: error instanceof Error ? error.message : error as string,
    };
  }
}

export default async function AdminProgramUploadImagePage({ params }: { params: Promise<{ id: string }>;  }) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return null;
  }
  
  const program = await findProgramById(id);

  if (program === null) {
    return null;
  }

  return (
    <section className="bg-foreground p-4">

     <ImageUploadForm ownerId={program.id} ownerInput="programId" currentImage={program.imageUrl ?? ProgramDefaultImage} action={programImageUpload} />
     
    </section>
  );
}
