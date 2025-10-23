import { notFound, redirect } from 'next/navigation';
import AdminDeleteProgramScheduleForm, { FormState } from './form';
import { deleteProgramActivity, findProgramActivityById } from '@/services/program-activity-service';

export async function programActivityDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists
  const programScheduleId = Number(formData.get('programScheduleId')); // TODO: In v2 check that ID exists
  const programActivityId = Number(formData.get('programActivityId')); // TODO: In v2 check that ID exists

  try {
    await deleteProgramActivity(programActivityId);
  } catch (error) {
    console.error('Error deleting program activity: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect(`/admin/programs/${programId}/activities?sid=${programScheduleId}`);
}

export default async function AdminDeleteProgramActivityPage({ params }: Readonly<{ params: Promise<{ id: string; aid: string; }>; }>) {
  const pathParams = await params;

  const programId = Number(pathParams.id);

  const id = Number(pathParams.aid);

  if (isNaN(id)) {
    notFound();
  }

  const activity = await findProgramActivityById(id);

  if (activity === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">
      
      <AdminDeleteProgramScheduleForm programId={programId} programActivity={activity} action={programActivityDelete} />

    </section>
  );
}
