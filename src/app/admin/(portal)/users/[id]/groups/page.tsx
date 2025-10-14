import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import GroupTableRow, { groupTableHeadings } from '@/components/group-table-row';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupMembersAndGroupsByUserId } from '@/services/group-member-service';

export default async function AdminUserGroupsPage(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
    
  const groups = await findGroupMembersAndGroupsByUserId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericTable
        items={groups.data}
        headings={groupTableHeadings}
        renderItem={(group) => <GroupTableRow key={group.groupMembers.id} group={group.groups!} />}
      />

      <PaginationList path={`/admin/users/${id}/groups`} pagination={groups} />

    </section>
  );
}
