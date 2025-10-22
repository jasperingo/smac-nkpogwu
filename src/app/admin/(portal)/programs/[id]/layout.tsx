import { notFound } from 'next/navigation';
import TabList from '@/components/tab-list';
import { findProgramById } from '@/services/program-service';
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
      <ItemPageTopDetails id={program.id} title={program.name} imageUrl='/program.png' />

      <TabList 
        path={`/admin/programs/${program.id}`}
        items={[
          { 
            text: 'Details',
            href: '',
          },
          { 
            text: 'Schedules',
            href: '/schedules',
          },
          { 
            text: 'Activities',
            href: '/activities',
          },
        ]} 
      />

      { children }
    </>
  );
}
