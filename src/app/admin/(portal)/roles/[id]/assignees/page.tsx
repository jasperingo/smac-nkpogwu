import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
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
        headings={[ 'ID', 'Name', 'Email', 'Phone', 'Membership', 'Action' ]}
        items={assignees.data}
        renderItem={(assignee) => (
          <tr key={assignee.roleAssignees.id}>
            <td className="p-2 border">{ assignee.roleAssignees.id }</td>
            <td className="p-2 border">{ assignee.users?.firstName } { assignee.users?.lastName }</td>
            <td className="p-2 border">{ assignee.users?.emailAddress ?? '(not set)' }</td>
            <td className="p-2 border">{ assignee.users?.phoneNumber ?? '(not set)' }</td>
            <td className="p-2 border">{ assignee.users?.membershipNumber ?? '(not set)' }</td>
            <td className="p-2 border">
              <div className="flex gap-2 flex-wrap">
                <ActionLink href={`/admin/users/${assignee.users?.id}`}>Profile</ActionLink>

                <ActionLink href={`/admin/roles/${id}/assignees/${assignee.roleAssignees.id}`}>Delete</ActionLink>
              </div>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/roles/${id}/assignees`} pagination={assignees} />

    </section>
  );
}
