import Link from 'next/link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findRoleAssigneesAndUsersByGroupId } from '@/services/role-assignee-service';

export default async function AdminGroupRoleAssigneesPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const assignees = await findRoleAssigneesAndUsersByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericTable
        headings={[ 'ID', 'Role', 'Name', 'Email', 'Phone', 'Membership', 'Action' ]}
        items={assignees.data}
        renderItem={(assignee) => (
          <tr key={assignee.roleAssignees.id}>
            <td className="p-2 border">{ assignee.roleAssignees.id }</td>
            <td className="p-2 border">{ assignee.roles?.name }</td>
            <td className="p-2 border">{ assignee.users?.firstName } { assignee.users?.lastName }</td>
            <td className="p-2 border">{ assignee.users?.emailAddress ?? '(not set)' }</td>
            <td className="p-2 border">{ assignee.users?.phoneNumber ?? '(not set)' }</td>
            <td className="p-2 border">{ assignee.users?.membershipNumber ?? '(not set)' }</td>
            <td className="p-2 border">
              <Link 
                href={`/admin/users/${assignee.users?.id}`}
                className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
              >Profile</Link>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/groups/${id}/role-assignees`} pagination={assignees} />

    </section>
  );
}
