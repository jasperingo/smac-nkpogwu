import MenuList from '@/components/menu-list';
import GenericTable from '@/components/generic-table';
import GroupTableRow from '@/components/group-table-row';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupsByParentId } from '@/services/group-service';

export default async function AdminGroupSubGroupsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const groups = await findGroupsByParentId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: `/admin/groups/create?parentId=${id}`, text: 'Add group' } ]} />

      <GenericTable
        headings={[ 'ID', 'Name', 'Privacy', 'Spotlight', 'Action' ]}
        items={groups.data}
        renderItem={(group) => <GroupTableRow key={group.id} group={group} />}
      />

      <PaginationList path={`/admin/groups/${id}/sub-groups`} pagination={groups} />

    </section>
  );
}
