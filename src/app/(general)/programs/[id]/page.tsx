
import { findProgramAndUserAndGroupById } from '@/services/program-service';


export default async function ProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  const program = (await findProgramAndUserAndGroupById(id))!;

  return (
    <section className="bg-foreground p-4">
      
      

    </section>
  );
}
