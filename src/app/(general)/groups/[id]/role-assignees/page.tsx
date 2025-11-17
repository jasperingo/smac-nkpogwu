import Link from 'next/link';
import { UserDefaultImage } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findRoleAssigneesAndUsersByGroupId } from '@/services/role-assignee-service';
import RoundedImage from '@/components/rounded-image';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function GroupRoleAssigneesPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const assignees = await findRoleAssigneesAndUsersByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={assignees.data}
        renderItem={(assignee) => (
          <li key={assignee.roleAssignees.id} className="mb-4 md:mb-0">
            <Link href={`/users/${assignee.users?.id}`} className="border p-2 flex gap-2 items-center">
              <RoundedImage
                alt={`${assignee.users?.id} image`}
                src={assignee.users?.imageUrl ?? UserDefaultImage} 
              />

              <div>
                <div className="font-bold">
                  { assignee.users?.title ?? '' } { assignee.users?.firstName } { assignee.users?.lastName } { assignee.users?.otherName ?? '' }
                </div>
                
                <div>{ assignee.roles?.name }</div>
                
                <div className="text-sm text-gray-600">{ assignee.roles?.contactable ? 'Is' : 'Is not' } person of contact</div>
              </div>
            </Link>
          </li>
        )}
      />

      <PaginationList path={`/groups/${id}/role-assignees`} pagination={assignees} />

    </section>
  );
}
