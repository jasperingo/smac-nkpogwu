import MenuList from '@/components/menu-list';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import UserTableRow, { userTableHeadings } from '@/components/user-table-row';
import { findGroupMembersAndUsersByGroupId } from '@/services/group-member-service';

export default async function AdminGroupMembersPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const members = await findGroupMembersAndUsersByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'members/create', text: 'Add member' } ]} />

      <GenericTable
        headings={userTableHeadings}
        items={members.data}
        renderItem={(member) => <UserTableRow key={member.groupMembers.id} user={member.users!} />}
      />

      <PaginationList path={`/admin/groups/${id}/members`} pagination={members} />

    </section>
  );
}
