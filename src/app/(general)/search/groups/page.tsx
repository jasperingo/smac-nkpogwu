import { getSession } from '@/utils/session';
import { GroupEntityPrivacy } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupsAndParents } from '@/services/group-service';
import GroupListItem from '@/components/group-list-item';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export default async function SearchGroupsPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string; page?: string; }>; }>) {
  const session = await getSession();

  const { page, search } = await searchParams;

  const groups = await findGroupsAndParents({ search, privacy: session === null ? GroupEntityPrivacy[0] : undefined }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={groups.data}
        renderItem={(group) => <GroupListItem key={group.groups.id} group={group} />}
      />
    
      <PaginationList path="/search/groups" pagination={groups} params={new Map([['search', search]])} />
    </section>
  );
}
