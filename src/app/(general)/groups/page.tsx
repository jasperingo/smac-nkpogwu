import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/utils/session';
import { findGroupsAndParents } from '@/services/group-service';
import { resolvePaginationParams } from '@/utils/pagination';
import { GroupDefaultImage, GroupEntityPrivacy } from '@/models/entity';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function GroupsPage({ searchParams }: Readonly<{ searchParams: Promise<{ page?: string; }>; }>) {
  const session = await getSession();

  const { page } = await searchParams;

  const groups = await findGroupsAndParents({ privacy: session === null ? GroupEntityPrivacy[0] : undefined, orderBySpotlightedTop: true }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList 
        items={groups.data}
        renderItem={(group) => (
          <li key={group.groups.id} className="mb-4 md:mb-0">
            <Link href={`/groups/${group.groups.id}`} className="border p-2 flex gap-2 items-center">
              <Image
                src={group.groups.imageUrl ?? GroupDefaultImage} 
                alt={`${group.groups.id} image`} 
                width="64" 
                height="64" 
                className="block w-16 h-16 border border-gray-400 rounded-full" 
              />

              <div>
                <div className="font-bold">{ group.groups.name }</div>
                
                { group.parent && <div>{ group.parent.name }</div> }
              </div>
            </Link>
          </li>
        )}
      />
     
      <PaginationList path="/groups" pagination={groups} />
    </section>
  );
}
