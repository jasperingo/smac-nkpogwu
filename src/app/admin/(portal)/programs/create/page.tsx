import z from 'zod';
import { redirect } from 'next/navigation';
import { 
  programDescriptionValidation, 
  programNameValidation, 
  programThemeValidation, 
  programTopicValidation 
} from '@/validations/programs-validation';
import { findGroupById } from '@/services/group-service';
import { createProgram } from '@/services/program-service';
import AdminCreateProgramForm, { type FormState } from './form';

const validationSchema = z.object({
  name: programNameValidation,
  theme: programThemeValidation,
  topic: programTopicValidation,
  description: programDescriptionValidation,
});

export async function programCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const groupId = Number(formData.get('groupId')); // TODO: In v2 check that ID exists
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

  let programId: number;

  try {
    programId = await createProgram({
      name, 
      theme: theme.length === 0 ? null : theme,
      topic: topic.length === 0 ? null : topic,
      description: description.length === 0 ? null : description,
      groupId: isNaN(groupId) || groupId < 1 ? null : groupId,
    });
  } catch (error) {
    console.error('Error creating program: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          name: null, 
          theme: null, 
          topic: null,
          description: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/programs/${programId}`);
}

export default async function AdminCreateProgramPage({ searchParams }: { searchParams: Promise<{ groupId?: string; }> }) {
  const groupId = Number((await searchParams).groupId);

  const group = isNaN(groupId) ? null : (await findGroupById(groupId));

  return (
    <section className="bg-foreground p-4">

      <AdminCreateProgramForm group={group} action={programCreate} />

    </section>
  );
}
