import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findRoleAssigneesAndGroupsByUserId } from '@/services/role-assignee-service';

export default async function AdminUserRolesPage(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
    
  const roles = await findRoleAssigneesAndGroupsByUserId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericTable
        items={roles.data}
        headings={[ 'ID', 'Role', 'Group', 'Action' ]}
        renderItem={(role) => (
          <tr key={role.roleAssignees.id}>
            <td className="p-2 border">{ role.roleAssignees.id }</td>
            <td className="p-2 border">{ role.roles?.name }</td>
            <td className="p-2 border">{ role.groups?.name ?? '(No group)' }</td>
            <td className="p-2 border">
              <ActionLink href={`/admin/roles/${role.roles?.id}`}>Details</ActionLink>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/users/${id}/roles`} pagination={roles} />

    </section>
  );
}
