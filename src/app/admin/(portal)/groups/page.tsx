import MenuList from '@/components/menu-list';
import SearchForm from '@/components/search-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import GroupTableRow, { groupTableHeadings } from '@/components/group-table-row';
import { findGroups } from '@/services/group-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminGroupsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  const groups = await findGroups({ search: search?.length === 0 ? undefined : search }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'groups/create', text: 'Add group' } ]} />

      <SearchForm value={search} action="/admin/groups" placeholder="Search by ID or Name" />

      <GenericTable
        items={groups.data}
        headings={groupTableHeadings}
        renderItem={(group) => <GroupTableRow key={group.id} group={group} />}
      />

      <PaginationList path="/admin/groups" pagination={groups} params={new Map([['search', search]])} />

    </section>
  );
}
