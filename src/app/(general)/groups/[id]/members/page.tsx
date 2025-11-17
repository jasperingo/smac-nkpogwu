import { redirect } from 'next/navigation';
import UserListItem from '@/components/user-list-item';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { getSession } from '@/utils/session';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupMembersAndUsersByGroupId } from '@/services/group-member-service';

export default async function GroupMembersPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const session = await getSession();

  if (session === null) {
    redirect('/sign-in');
  }

  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const members = await findGroupMembersAndUsersByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList
        items={members.data}
        renderItem={(member) => member.users === null ? null : <UserListItem key={member.groupMembers.id} user={member.users} />}
      />

      <PaginationList path={`/groups/${id}/members`} pagination={members} />

    </section>
  );
}
