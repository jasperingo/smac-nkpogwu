import { redirect } from 'next/navigation';
import { deleteProgram } from '@/services/program-service';
import DeleteForm, { FormState } from '@/components/delete-form';

async function programDelete(state: FormState, formData: FormData): Promise<FormState> {
  'use server'

  const programId = Number(formData.get('programId')); // TODO: In v2 check that ID exists

  try {
    await deleteProgram(programId);
  } catch (error) {
    console.error('Error deleting program: ', error);

    return { 
      value: false,
      error: error instanceof Error ? error.message : error as string, 
    };
  }

  redirect('/admin/programs');
}

export default async function AdminDeleteProgramPage({ params }: Readonly<{ params: Promise<{ id: string; }>; }>) {
  const id = Number((await params).id);

  return (
    <section className="bg-foreground p-4">
      
      <DeleteForm itemId={id} itemName="program" itemInput="programId" action={programDelete} />

    </section>
  );
}
