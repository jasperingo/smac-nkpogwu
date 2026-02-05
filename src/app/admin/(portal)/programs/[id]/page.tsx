import z from 'zod';
import { 
  programDescriptionValidation, 
  programNameValidation, 
  programThemeValidation, 
  programTopicValidation 
} from '@/validations/programs-validation';
import AdminUpdateProgramForm, { FormState } from './form';
import { findProgramAndUserAndGroupById, updateProgam } from '@/services/program-service';

const validationSchema = z.object({
  name: programNameValidation.optional(),
  theme: programThemeValidation.optional(),
  topic: programTopicValidation.optional(),
  description: programDescriptionValidation.optional(),
});

async function programUpdate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId'));
  const name = formData.get('name') as string;
  const theme = formData.get('theme') as string;
  const topic = formData.get('topic') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, theme, topic, description };

  const validatedResult = await validationSchema.safeParseAsync({
    name: name !== state.values.name || state.errors.fields.name !== null ? name : undefined, 
    theme: theme !== state.values.theme || state.errors.fields.theme !== null ? theme : undefined,
    topic: topic !== state.values.topic || state.errors.fields.topic !== null ? topic : undefined,
    description: description !== state.values.description || state.errors.fields.description !== null ? description : undefined,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      success: false,
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

  try {
    const program = await updateProgam(programId, {
      name: name !== state.values.name ? name : undefined, 
      theme: theme !== state.values.theme ? (theme.length === 0 ? null : theme) : undefined,
      topic: topic !== state.values.topic ? (topic.length === 0 ? null : topic) : undefined,
      description: description !== state.values.description ? (description.length === 0 ? null : description) : undefined,
    });
  
    if (program === null) {
      throw new Error('Update program return value is null');
    }

    return {
      success: true,
      errors: { 
        message: null, 
        fields: { 
          name: null, 
          theme: null, 
          topic: null,
          description: null, 
        },
      },
      values: {
        name: program.name,
        theme: program.theme ?? '', 
        topic: program.topic ?? '', 
        description: program.description ?? '', 
      },
    };
  } catch (error) {
    console.error('Error updating program: ', error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        fields: { 
          name: null, 
          theme: null, 
          topic: null,
          description: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }
}

export default async function AdminProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return null;
  }
  
  const program = await findProgramAndUserAndGroupById(id);

  if (program === null) {
    return null;
  }

  return (
    <section className="bg-foreground p-4">
      
      <AdminUpdateProgramForm program={program.programs} user={program.users} group={program.groups} action={programUpdate} />

    </section>
  );
}
