import Image from 'next/image';
import { notFound } from 'next/navigation';
import TabList from '@/components/tab-list';
import { findProgramById } from '@/services/program-service';

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
      <div className="bg-foreground p-4 mb-4 md:flex md:gap-4 md:items-center md:justify-center">
        <Image 
          src={`/program.png`} 
          alt={`${program.name} profile image`} 
          width="64" 
          height="64" 
          className="block mx-auto mb-2 border border-gray-400 rounded-full md:m-0 md:w-24 md:h-24" 
        />

        <div className="text-center">
          <div className="mb-2 font-bold text-lg md:text-xl">{ program.name }</div>

          <div className="w-fit mx-auto py-1 px-4 text-on-primary bg-primary-variant">ID: { program.id }</div>
        </div>
      </div>

      
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
        ]} 
      />

      { children }
    </>
  );
}
