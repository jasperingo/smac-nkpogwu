import Link from 'next/link';
import MenuList from '@/components/menu-list';
import SearchForm from '@/components/search-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { findGroups } from '@/services/group-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminGroupsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  const groups = await findGroups({ ...resolvePaginationParams(page), search: search?.length === 0 ? undefined : search });

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'groups/create', text: 'Add group' } ]} />

      <SearchForm value={search} action="/admin/groups" placeholder="Search by ID or Name" />

      <GenericTable
        headings={[ 'ID', 'Name', 'Privacy', 'Spotlight', 'Action' ]}
        items={groups.data}
        renderItem={(group) => (
          <tr key={group.id}>
            <td className="p-2 border">{ group.id }</td>
            <td className="p-2 border">{ group.name }</td>
            <td className="p-2 border">{ group.privacy }</td>
            <td className="p-2 border">{ group.spotlighted ? 'Yes' : 'No' }</td>
            <td className="p-2 border">
              <Link 
                href={`/admin/groups/${group.id}`}
                className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
              >Profile</Link>
            </td>
          </tr>
        )}
      />

      <PaginationList path="/admin/groups" pagination={groups} params={new Map([['search', search]])} />

    </section>
  );
}
