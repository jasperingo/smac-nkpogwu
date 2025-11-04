import z from 'zod';
import { notFound } from 'next/navigation';
import AdminUpdateProgramActivityForm, { FormState } from './form';
import { findProgramActivityById, programActivityExistByName, updateProgramActivity } from '@/services/program-activity-service';

const validationSchema = z.object({
  programScheduleId: z.number(),
  name: z.string().nonempty().optional(),
  description: z.union([z.literal(''), z.string().nonempty()]).optional(),
})
.refine(async (dto) => dto.name ? !(await programActivityExistByName(dto.programScheduleId, dto.name)) : true, { 
  path: ['name'],
  error: 'An activity with this name already exists for this program schedule', 
});

export async function programActivityUpdate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programScheduleId = Number(formData.get('programScheduleId')); // TODO: In v2 check that ID exists
  const programActivityId = Number(formData.get('programActivityId')); // TODO: In v2 check that ID exists
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, description };
 
   const validatedResult = await validationSchema.safeParseAsync({ 
    programScheduleId, 
    name: name !== state.values.name || state.errors.fields.name !== null ? name : undefined, 
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
          description: errors.fieldErrors.description?.[0] ?? null,
        }, 
      },
    };
  }

  try {
    const activity = await updateProgramActivity(programActivityId, {
      name: name !== state.values.name ? name : undefined,
      description: description !== state.values.description ? (description.length === 0 ? null : description) : undefined,
    });
  
    if (activity === null) {
      throw new Error('Update program activity return value is null');
    }

    return {
      success: true,
      errors: { 
        message: null, 
        fields: { 
          name: null,
          description: null, 
        },
      },
      values: {
        name: activity.name, 
        description: activity.description ?? '', 
      },
    };
  } catch (error) {
    console.error('Error updating program activity: ', error);

    return { 
      success: false,
      values: formStateValues,
      errors: { 
        fields: { 
          name: null,
          description: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      },
    };
  }
}

export default async function AdminUpdateProgramActivityPage({ params }: Readonly<{ params: Promise<{ aid: string; }>; }>) {
  const id = Number((await params).aid);

  if (isNaN(id)) {
    notFound();
  }

  const activity = await findProgramActivityById(id);

  if (activity === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">
      
      <AdminUpdateProgramActivityForm programActivity={activity} action={programActivityUpdate} />

    </section>
  );
}
