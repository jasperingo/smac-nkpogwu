import Link from 'next/link';
import Image from 'next/image';
import { UserDefaultImage } from '@/models/entity';
import { findUsers } from '@/services/user-service';
import { resolvePaginationParams } from '@/utils/pagination';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ page?: string; }> }) {
  const { page } = await searchParams;

  const users = await findUsers({ }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={users.data}
        renderItem={(user) => (
          <li key={user.id} className="mb-4 md:mb-0">
            <Link href={`/users/${user.id}`} className="border p-2 flex gap-2 items-center">
              <Image
                src={user.imageUrl ?? UserDefaultImage} 
                alt={`${user.id} image`} 
                width="64" 
                height="64" 
                className="block w-16 h-16 border border-gray-400 rounded-full" 
              />

              <div>
                <div className="font-bold">{ user.title ?? '' } { user.firstName } { user.lastName } { user.otherName ?? '' }</div>
                
                <div>{ user.gender.substring(0, 1) + user.gender.substring(1).toLowerCase() }</div>
              </div>
            </Link>
          </li>
        )}
      />

      <PaginationList path="/users" pagination={users} />

    </section>
  );
}
