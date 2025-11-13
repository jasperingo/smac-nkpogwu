import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import { GroupEntityPrivacy, ProgramDefaultImage } from '@/models/entity';
import { findProgramAndUserAndGroupById } from '@/services/program-service';
import ItemPageTopDetails from '@/components/item-page-top-details';

export default async function ProgramLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const session = await getSession();

  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const program = await findProgramAndUserAndGroupById(id);

  if (program === null) {
    notFound();
  }

  if (session === null && (program.users !== null || (program.groups !== null && program.groups.privacy === GroupEntityPrivacy[1]))) {
    redirect('/sign-in')
  }

  return (
    <>
      <ItemPageTopDetails title={program.programs.name} imageUrl={program.programs.imageUrl ?? ProgramDefaultImage} />

      { children }
    </>
  );
}
