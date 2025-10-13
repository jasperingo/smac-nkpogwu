import z from 'zod';
import { redirect } from 'next/navigation';
import { createGroup, findGroupById } from '@/services/group-service';
import { 
  programDescriptionValidation, 
  programNameValidation, 
  programThemeValidation, 
  programTopicValidation 
} from '@/validations/programs-validation';
import AdminCreateProgramForm, { type FormState } from './form';

const validationSchema = z.object({
  name: programNameValidation,
  theme: programThemeValidation,
  topic: programTopicValidation,
  description: programDescriptionValidation,
});

export async function programCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  // const parentId = Number(formData.get('parentId')); // TODO: In v2 check that ID exists
  const name = formData.get('name') as string;
  const theme = formData.get('theme') as string;
  const topic = formData.get('topic') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, theme, topic, description };

  const validatedResult = await validationSchema.safeParseAsync({
    name, 
    theme,
    topic,
    description,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          name: errors.fieldErrors.name?.[0] ?? null,
          theme: errors.fieldErrors.theme?.[0] ?? null,
          topic: errors.fieldErrors.topic?.[0] ?? null,
          description: errors.fieldErrors.description?.[0] ?? null,
        }, 
      },
    };
  }

  // let groupId: number;

  // try {
  //   groupId = await createGroup({
  //     name, 
  //     privacy: privacy as any,
  //     spotlighted: spotlighted === 'true',
  //     parentId: isNaN(parentId) || parentId < 1 ? null : parentId,
  //     description: description.length === 0 ? null : description,
  //   });
  // } catch (error) {
  //   console.error('Error creating group: ', error);

  //   return { 
  //     values: formStateValues,
  //     errors: { 
  //       fields: {
  //         name: null, 
  //         privacy: null, 
  //         description: null, 
  //         spotlighted: null,
  //       },
  //       message: error instanceof Error ? error.message : error as string, 
  //     }
  //   };
  // }

  // redirect(`/admin/groups/${groupId}`);

  
  return state;
}

export default async function AdminCreateProgramPage({ searchParams }: { searchParams: Promise<{ parentId?: string; }> }) {
  // const parentId = Number((await searchParams).parentId);

  // const group = isNaN(parentId) ? null : (await findGroupById(parentId));

  return (
    <section className="bg-foreground p-4">

      <AdminCreateProgramForm  action={programCreate} />

    </section>
  );
}
