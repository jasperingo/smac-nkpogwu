import { notFound } from 'next/navigation';
import TabList from '@/components/tab-list';
import { findRoleAndGroupById } from '@/services/role-service';

export default async function AdminRoleLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const role = await findRoleAndGroupById(id);

  if (role === null) {
    notFound();
  }

  return (
    <>
      <div className="bg-foreground p-4 mb-4">
        <div className="mb-2 font-bold text-center text-lg md:text-xl">{ role.roles.name } { role.groups && `(${role.groups.name})` }</div>

        <div className="w-fit mx-auto py-1 px-4 text-on-primary bg-primary-variant">ID: { role.roles.id }</div>
      </div>

      <TabList 
        path={`/admin/roles/${id}`}
        items={[
          { 
            text: 'Details',
            href: '',
          },
          { 
            text: 'Assignees',
            href: '/assignees',
          },
        ]} 
      />

      { children }
    </>
  );
}
