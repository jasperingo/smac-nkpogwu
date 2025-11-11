import Link from 'next/link';
import Image from 'next/image';
import { GroupDefaultImage } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupsByParentId } from '@/services/group-service';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function GroupSubGroupsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const groups = await findGroupsByParentId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList 
        items={groups.data}
        renderItem={(group) => (
          <li key={group.id} className="mb-4 md:mb-0">
            <Link href={`/groups/${group.id}`} className="border p-2 flex gap-2 items-center">
              <Image
                src={group.imageUrl ?? GroupDefaultImage} 
                alt={`${group.id} image`} 
                width="64" 
                height="64" 
                className="block w-16 h-16 border border-gray-400 rounded-full" 
              />

              <div>
                <div className="font-bold">{ group.name }</div>
              </div>
            </Link>
          </li>
        )}
      />

      <PaginationList path={`/groups/${id}/sub-groups`} pagination={groups} />

    </section>
  );
}
