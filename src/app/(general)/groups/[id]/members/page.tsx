import Link from 'next/link';
import Image from 'next/image';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { UserDefaultImage } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupMembersAndUsersByGroupId } from '@/services/group-member-service';

export default async function GroupMembersPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const members = await findGroupMembersAndUsersByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={members.data}
        renderItem={(member) => (
          <li key={member.groupMembers.id} className="mb-4 md:mb-0">
            <Link href={`/users/${member.users?.id}`} className="border p-2 flex gap-2 items-center">
              <Image
                src={member.users?.imageUrl ?? UserDefaultImage} 
                alt={`${member.users?.id} image`} 
                width="64" 
                height="64" 
                className="block w-16 h-16 border border-gray-400 rounded-full" 
              />

              <div>
                <div className="font-bold">{ member.users?.title ?? '' } { member.users?.firstName } { member.users?.lastName } { member.users?.otherName ?? '' }</div>
                
                <div>{ member.users ? member.users.gender.substring(0, 1) + member.users.gender.substring(1).toLowerCase() : '' }</div>
              </div>
            </Link>
          </li>
        )}
      />

      <PaginationList path={`/groups/${id}/members`} pagination={members} />

    </section>
  );
}
