import z from 'zod';
import { notFound, redirect } from 'next/navigation';
import SearchForm from '@/components/search-form';
import AdminCreateProgramCoordinatorForm, { FormState } from './form';
import { resolvePaginationParams } from '@/utils/pagination';
import { createProgramCoordinator } from '@/services/program-coordinator-service';
import { findUsersNotCoordinatorInProgramSchedule } from '@/services/user-service';
import { findProgramScheduleByIdAndProgramId } from '@/services/program-schedule-service';

const validationSchema = z.object({
  role: z.string().nonempty(),
  spotlighted: z.boolean(),
  userId: z.number('User not selected').gt(0, 'User not selected'),
});

export async function programCoordinatorCreate(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists
  const programScheduleId = Number(formData.get('programScheduleId')); // TODO: In v2 check that ID exists
  const userId = Number(formData.get('userId'));
  const role = formData.get('role') as string;
  const spotlighted = formData.get('spotlighted') as string;

  const formStateValues: FormState['values'] = { userId, role, spotlighted };

  const validatedResult = await validationSchema.safeParseAsync({
    role, 
    userId,
    spotlighted: spotlighted === 'true',
  });

  if (!validatedResult.success) {
    const errors = z.flattenError(validatedResult.error);

    return { 
      values: formStateValues,
      errors: { 
        message: errors.fieldErrors.userId?.[0] ?? null, 
        fields: {
          role: errors.fieldErrors.role?.[0] ?? null,
          spotlighted: errors.fieldErrors.spotlighted?.[0] ?? null,
        }, 
      },
    };
  }

  try {
    await createProgramCoordinator({
      name: null,
      role,
      userId,
      programScheduleId, 
      spotlighted: spotlighted === 'true',
    });
  } catch (error) {
    console.error('Error creating program coordinator: ', error);

    return { 
      values: formStateValues,
      errors: { 
        fields: {
          role: null,
          spotlighted: null, 
        },
        message: error instanceof Error ? error.message : error as string, 
      }
    };
  }

  redirect(`/admin/programs/${programId}/coordinators?sid=${programScheduleId}`);
}

export default async function AdminCreateProgramCoordinatorPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ sid?: string; page?: string; search?: string; }>; }>
) {
  const id = Number((await params).id);

  const { sid, page, search } = await searchParams;

  const scheduleId = Number(sid);

  if (isNaN(scheduleId)) {
    notFound();
  }

  const schedule = await findProgramScheduleByIdAndProgramId(scheduleId, id);

  if (schedule === null) {
    notFound();
  }
  
  const users = await findUsersNotCoordinatorInProgramSchedule(
    { programScheduleId: scheduleId, search: search?.length === 0 ? undefined : search }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <SearchForm 
        value={search} 
        action={`/admin/programs/${id}/coordinators/create`} 
        extraParams={new Map([['sid', scheduleId.toString()]])}
        placeholder="Search by ID, Name, Email, Phone or Membership" 
      />

      <AdminCreateProgramCoordinatorForm 
        users={users} 
        search={search} 
        programSchedule={schedule} 
        action={programCoordinatorCreate} 
      />

    </section>
  );
}
