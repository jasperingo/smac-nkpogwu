import z from 'zod';
import { notFound, redirect } from 'next/navigation';
import AdminCreateProgramActivityForm, { FormState } from './form';
import { findProgramScheduleById,} from '@/services/program-schedule-service';
import { createProgramActivity, programActivityExistByName } from '@/services/program-activity-service';

const validationSchema = z.object({
  programScheduleId: z.number(),
  name: z.string().nonempty(),
  description: z.union([z.literal(''), z.string().nonempty()]),
})
.refine(async (dto) => !(await programActivityExistByName(dto.programScheduleId, dto.name)), { 
  path: ['name'],
  error: 'An activity with this name already exists for this program schedule', 
});

async function programActivityCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists
  const programScheduleId = Number(formData.get('programScheduleId')); // TODO: In v2 check that ID exists
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const formStateValues: FormState['values'] = { name, description };

  const validatedResult = await validationSchema.safeParseAsync({ programScheduleId, name, description });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
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
    await createProgramActivity({
      name,
      programScheduleId, 
      description: description.length === 0 ? null : description,
    });
  } catch (error) {
    console.error('Error creating program activity: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          name: null,
          description: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/programs/${programId}/activities?sid=${programScheduleId}`);
}

export default async function AdminCreateProgramActivityPage({ searchParams }: Readonly<{ searchParams: Promise<{ sid?: string; }>; }>) {
  const scheduleId = Number((await searchParams).sid);

  if (isNaN(scheduleId)) {
    notFound();
  }

  const schedule = await findProgramScheduleById(scheduleId);

  if (schedule === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">

      <AdminCreateProgramActivityForm programSchedule={schedule} action={programActivityCreate} />

    </section>
  );
}
