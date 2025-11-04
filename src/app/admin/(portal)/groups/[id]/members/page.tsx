import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupMembersAndUsersByGroupId } from '@/services/group-member-service';

export default async function AdminGroupMembersPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const members = await findGroupMembersAndUsersByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'members/create', text: 'Add member' } ]} />

      <GenericTable
        headings={[ 'ID', 'Name', 'Email', 'Phone', 'Membership', 'Action' ]}
        items={members.data}
        renderItem={(member) => (
          <tr key={member.groupMembers.id}>
            <td className="p-2 border">{ member.groupMembers.id }</td>
            <td className="p-2 border">{ member.users?.firstName } { member.users?.lastName }</td>
            <td className="p-2 border">{ member.users?.emailAddress ?? '(not set)' }</td>
            <td className="p-2 border">{ member.users?.phoneNumber ?? '(not set)' }</td>
            <td className="p-2 border">{ member.users?.membershipNumber ?? '(not set)' }</td>
            <td className="p-2 border">
              <div className="flex gap-2 flex-wrap">
                <ActionLink href={`/admin/users/${member.users?.id}`}>Profile</ActionLink>

                <ActionLink href={`/admin/groups/${id}/members/${member.groupMembers.id}`}>Delete</ActionLink>
              </div>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/groups/${id}/members`} pagination={members} />

    </section>
  );
}
