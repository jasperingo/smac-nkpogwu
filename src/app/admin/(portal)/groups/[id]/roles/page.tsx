import Link from 'next/link';
import MenuList from '@/components/menu-list';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { findRolesByGroupId } from '@/services/role-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminGroupRolesPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const roles = await findRolesByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: `/admin/roles/create?groupId=${id}`, text: 'Add role' } ]} />

      <GenericTable
        items={roles.data}
        headings={['ID', 'Name', 'Is contact', 'Action']}
        renderItem={(role) => (
           <tr key={role.id}>
            <td className="p-2 border">{ role.id }</td>
            <td className="p-2 border">{ role.name }</td>
            <td className="p-2 border">{ role.contactable ? 'Yes' : 'No' }</td>
            <td className="p-2 border">
              <Link 
                href={`/admin/roles/${role.id}`}
                className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
              >Details</Link>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/groups/${id}/roles`} pagination={roles} />

    </section>
  );
}
