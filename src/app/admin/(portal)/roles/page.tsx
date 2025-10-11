import Link from 'next/link';
import MenuList from '@/components/menu-list';
import SearchForm from '@/components/search-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { findRolesAndGroup } from '@/services/role-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminRolesPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  const roles = await findRolesAndGroup(search?.length === 0 ? null : search ?? null, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'roles/create', text: 'Add role' } ]} />

      <SearchForm value={search} action="/admin/roles" placeholder="Search by ID or Name" />

      <GenericTable
        headings={['ID', 'Name', 'Group', 'Is contact', 'Action']}
        items={roles.data}
        renderItem={(role) => (
           <tr key={role.roles.id}>
            <td className="p-2 border">{ role.roles.id }</td>
            <td className="p-2 border">{ role.roles.name }</td>
            <td className="p-2 border">{ role.groups ? role.groups.name : '(not set)' }</td>
            <td className="p-2 border">{ role.roles.contactable ? 'Yes' : 'No' }</td>
            <td className="p-2 border">
              <Link 
                href={`/admin/roles/${role.roles.id}`}
                className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
              >Details</Link>
            </td>
          </tr>
        )}
      />

      <PaginationList path="/admin/roles" pagination={roles} params={new Map([['search', search]])} />

    </section>
  );
}
