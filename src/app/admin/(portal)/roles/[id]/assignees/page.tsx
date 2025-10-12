import MenuList from '@/components/menu-list';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import UserTableRow, { userTableHeadings } from '@/components/user-table-row';
import { findRoleAssigneesAndUsersByRoleId } from '@/services/role-assignee-service';

export default async function AdminRoleAssigneesPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const assignees = await findRoleAssigneesAndUsersByRoleId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'assignees/create', text: 'Add assignee' } ]} />

      <GenericTable
        headings={userTableHeadings}
        items={assignees.data}
        renderItem={(assignee) => <UserTableRow key={assignee.roleAssignees.id} user={assignee.users!} />}
      />

      <PaginationList path={`/admin/roles/${id}/assignees`} pagination={assignees} />

    </section>
  );
}
