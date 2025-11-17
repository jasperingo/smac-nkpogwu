import GroupListItem from '@/components/group-list-item';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
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
        renderItem={(group) => group.groups === null ? null : <GroupListItem key={group.groupMembers.id} group={{ groups: group.groups }} />}
      />

      <PaginationList path={`/users/${id}/groups`} pagination={groups} />

    </section>
  );
}
