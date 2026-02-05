import { notFound, redirect } from 'next/navigation';
import AdminDeleteProgramScheduleForm, { FormState } from './form';
import { deleteProgramCoordinator, findProgramCoordinatorAndUserById } from '@/services/program-coordinator-service';

async function programCoordinatorDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists
  const programScheduleId = Number(formData.get('programScheduleId')); // TODO: In v2 check that ID exists
  const programCoordinatorId = Number(formData.get('programCoordinatorId')); // TODO: In v2 check that ID exists

  try {
    await deleteProgramCoordinator(programCoordinatorId);
  } catch (error) {
    console.error('Error deleting program coordinator: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect(`/admin/programs/${programId}/coordinators?sid=${programScheduleId}`);
}

export default async function AdminDeleteProgramCoordinatorPage({ params }: Readonly<{ params: Promise<{ id: string; cid: string; }>; }>) {
  const pathParams = await params;

  const programId = Number(pathParams.id);

  const id = Number(pathParams.cid);

  if (isNaN(id)) {
    notFound();
  }

  const coordinator = await findProgramCoordinatorAndUserById(id);

  if (coordinator === null) {
    notFound();
  }

  return (
    <section className="bg-foreground p-4">
      
      <AdminDeleteProgramScheduleForm 
        programId={programId} 
        programCoordinator={coordinator.programCoordinators} 
        programCoordinatorUser={coordinator.users} 
        action={programCoordinatorDelete} 
      />

    </section>
  );
}
