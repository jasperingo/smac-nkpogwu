import z from 'zod';
import { notFound, redirect } from 'next/navigation';
import AdminCreateGuestProgramCoordinatorForm, { FormState } from './form';
import { findProgramScheduleByIdAndProgramId,} from '@/services/program-schedule-service';
import { createProgramCoordinator, programCoordinatorExistByName } from '@/services/program-coordinator-service';

const validationSchema = z.object({
  programScheduleId: z.number(),
  role: z.string().nonempty(),
  spotlighted: z.boolean(),
  name: z.string().nonempty(),
})
.refine(async (dto) => !(await programCoordinatorExistByName(dto.programScheduleId, dto.name)), { 
  path: ['name'],
  error: 'A coordinator with this name already exists', 
});

async function guestProgramCoordinatorCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists
  const programScheduleId = Number(formData.get('programScheduleId')); // TODO: In v2 check that ID exists
  const name = formData.get('name') as string;
  const role = formData.get('role') as string;
  const spotlighted = formData.get('spotlighted') as string;

  const formStateValues: FormState['values'] = { name, role, spotlighted };

  const validatedResult = await validationSchema.safeParseAsync({
    name,
    role, 
    spotlighted: spotlighted === 'true',
    programScheduleId,
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: null, 
        fields: {
          name: errors.fieldErrors.name?.[0] ?? null, 
          role: errors.fieldErrors.role?.[0] ?? null,
          spotlighted: errors.fieldErrors.spotlighted?.[0] ?? null,
        }, 
      },
    };
  }

  try {
    await createProgramCoordinator({
      name,
      role,
      userId: null,
      programScheduleId, 
      spotlighted: spotlighted === 'true',
    });
  } catch (error) {
    console.error('Error creating guest program coordinator: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          name: null,
          role: null,
          spotlighted: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/programs/${programId}/coordinators?sid=${programScheduleId}`);
}

export default async function AdminCreateGuestProgramCoordinatorPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ sid?: string; }>; }>
) {
  const id = Number((await params).id);

  const scheduleId = Number((await searchParams).sid);

  if (isNaN(scheduleId)) {
    notFound();
  }

  const schedule = await findProgramScheduleByIdAndProgramId(scheduleId, id);

  if (schedule === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">

      <AdminCreateGuestProgramCoordinatorForm programSchedule={schedule} action={guestProgramCoordinatorCreate} /> 

    </section>
  );
}
