import Link from 'next/link';
import Image from 'next/image';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { GroupDefaultImage } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupMembersAndGroupsAndParentsByUserId } from '@/services/group-member-service';

export default async function UserGroupsPage(
  { params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
    
  const groups = await findGroupMembersAndGroupsAndParentsByUserId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={groups.data}
        renderItem={(group) => (
          <li key={group.groupMembers.id} className="mb-4 md:mb-0">
            <Link href={`/groups/${group.groups?.id}`} className="border p-2 flex gap-2 items-center">
              <Image
                src={group.groups?.imageUrl ?? GroupDefaultImage} 
                alt={`${group.groups?.id} image`} 
                width="64" 
                height="64" 
                className="block w-16 h-16 border border-gray-400 rounded-full" 
              />

              <div>
                <div className="font-bold">{ group.groups?.name }</div>
                
                { group.parent && <div>{ group.parent.name }</div> }
              </div>
            </Link>
          </li>
        )}
      />

      <PaginationList path={`/users/${id}/groups`} pagination={groups} />

    </section>
  );
}
