import { notFound } from 'next/navigation';
import { ProgramDefaultImage } from '@/models/entity';
import { findProgramById } from '@/services/program-service';
import TabList from '@/components/tab-list';
import ItemPageTopDetails from '@/components/item-page-top-details';

export default async function AdminProgramLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const program = await findProgramById(id);

  if (program === null) {
    notFound();
  }

  return (
    <>
      <ItemPageTopDetails id={program.id} title={program.name} imageUrl={program.imageUrl ?? ProgramDefaultImage} />

      <TabList 
        path={`/admin/programs/${program.id}`}
        items={[
          { 
            text: 'Details',
            href: '',
          },
          { 
            text: 'Upload image',
            href: '/upload-image',
          },
          { 
            text: 'Schedules',
            href: '/schedules',
          },
          { 
            text: 'Activities',
            href: '/activities',
          },
          { 
            text: 'Coordinators',
            href: '/coordinators',
          },
          { 
            text: 'Delete',
            href: '/delete',
          },
        ]} 
      />

      { children }
    </>
  );
}
