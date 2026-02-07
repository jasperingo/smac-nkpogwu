import { Metadata } from 'next';
import { getSession } from '@/utils/session';
import { GroupEntityPrivacy } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { PAGE_METADATA_TITLE_SUFFIX } from '@/utils/constants';
import { findGroupsAndParents } from '@/services/group-service';
import GroupListItem from '@/components/group-list-item';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Groups' + PAGE_METADATA_TITLE_SUFFIX,
  description: 'List of church groups',
};

export default async function GroupsPage({ searchParams }: Readonly<{ searchParams: Promise<{ page?: string; }>; }>) {
  const session = await getSession();

  const { page } = await searchParams;

  const groups = await findGroupsAndParents({ privacy: session === null ? GroupEntityPrivacy[0] : undefined, orderBySpotlightedTop: true }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList 
        items={groups.data}
        renderItem={(group) => <GroupListItem key={group.groups.id} group={group} />}
      />
     
      <PaginationList path="/groups" pagination={groups} />
    </section>
  );
}
