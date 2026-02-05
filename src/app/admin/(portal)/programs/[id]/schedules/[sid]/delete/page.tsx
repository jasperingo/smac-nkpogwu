import { notFound, redirect } from 'next/navigation';
import AdminDeleteProgramScheduleForm, { FormState } from './form';
import { deleteProgramSchedule, findProgramScheduleById } from '@/services/program-schedule-service';

async function programScheduleDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists
  const programScheduleId = Number(formData.get('programScheduleId')); // TODO: In v2 check that ID exists

  try {
    await deleteProgramSchedule(programScheduleId);
  } catch (error) {
    console.error('Error deleting program schedule: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect(`/admin/programs/${programId}/schedules`);
}

export default async function AdminDeleteProgramSchedulePage({ params }: Readonly<{ params: Promise<{ sid: string; }>; }>) {
  const id = Number((await params).sid);

  if (isNaN(id)) {
    notFound();
  }

  const schedule = await findProgramScheduleById(id);

  if (schedule === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">
      
      <AdminDeleteProgramScheduleForm programSchedule={schedule} action={programScheduleDelete} />

    </section>
  );
}
