import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupsByParentId } from '@/services/group-service';
import GroupListItem from '@/components/group-list-item';
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
        renderItem={(group) => <GroupListItem key={group.id} group={{ groups: group }} />}
      />

      <PaginationList path={`/groups/${id}/sub-groups`} pagination={groups} />

    </section>
  );
}
