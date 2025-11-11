import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findRoleAssigneesAndGroupsByUserId } from '@/services/role-assignee-service';

export default async function UserRolesPage(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
    
  const roles = await findRoleAssigneesAndGroupsByUserId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={roles.data}
        renderItem={(role) => (
          <li key={role.roleAssignees.id}>
            <div className="border p-2">
              <div className="font-bold">{ role.roles?.name }</div>

              { role.groups && <div>{ role.groups.name }</div> }
              
              <div className="text-sm text-gray-600">{ role.roles?.contactable ? 'Is' : 'Is not' } person of contact</div>
            </div>
          </li>
        )}
      />

      <PaginationList path={`/users/${id}/roles`} pagination={roles} />

    </section>
  );
}
