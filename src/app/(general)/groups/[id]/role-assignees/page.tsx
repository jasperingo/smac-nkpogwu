import Link from 'next/link';
import Image from 'next/image';
import { UserDefaultImage } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findRoleAssigneesAndUsersByGroupId } from '@/services/role-assignee-service';
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
              <Image
                src={assignee.users?.imageUrl ?? UserDefaultImage} 
                alt={`${assignee.users?.id} image`} 
                width="64" 
                height="64" 
                className="block w-16 h-16 border border-gray-400 rounded-full" 
              />

              <div>
                <div className="font-bold">
                  { assignee.users?.title ?? '' } { assignee.users?.firstName } { assignee.users?.lastName } { assignee.users?.otherName ?? '' }
                </div>
                
                <div>{ assignee.roles?.name }</div>
              </div>
            </Link>
          </li>
        )}
      />

      <PaginationList path={`/groups/${id}/role-assignees`} pagination={assignees} />

    </section>
  );
}
