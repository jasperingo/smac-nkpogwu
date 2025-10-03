import Image from 'next/image';
import { notFound } from 'next/navigation';
import TabList from '@/components/tab-list';
import { findGroupById } from '@/services/group-service';

export default async function AdminGroupLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const group = await findGroupById(id);

  if (group === null) {
    notFound();
  }

  return (
    <>
      <div className="bg-foreground p-4 mb-4 md:flex md:gap-4 md:items-center md:justify-center">
        <Image 
          src={`/group.png`} 
          alt={`${group.name} profile image`} 
          width="64" 
          height="64" 
          className="block mx-auto mb-2 border border-gray-400 rounded-full md:m-0 md:w-24 md:h-24" 
        />

        <div className="text-center">
          <div className="mb-2 font-bold text-lg md:text-xl">{ group.name }</div>

          <div className="w-fit mx-auto py-1 px-4 text-on-primary bg-primary-variant">ID: { group.id }</div>
        </div>
      </div>

      
      <TabList 
        items={[
          { 
            text: 'Details',
            href: `/admin/groups/${group.id}`,
          },
          // { 
          //   text: 'Groups',
          //   href: `/admin/groups/${group.id}/groups`,
          // },
        ]} 
      />

      { children }
    </>
  );
}
