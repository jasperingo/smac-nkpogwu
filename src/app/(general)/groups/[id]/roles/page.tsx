import { findRolesByGroupId } from '@/services/role-service';
import { resolvePaginationParams } from '@/utils/pagination';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function GroupRolesPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const roles = await findRolesByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={roles.data}
        renderItem={(role) => (
          <li key={role.id} className="mb-4 md:mb-0">
            <div  className="border p-2">
              <div className="font-bold">{ role.name }</div>
            </div>
          </li>
        )}
      />

      <PaginationList path={`/groups/${id}/roles`} pagination={roles} />

    </section>
  );
}
