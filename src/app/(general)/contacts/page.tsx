import { Metadata } from 'next';
import PaginationList from '@/components/pagination-list';
import ContactListItem from '@/components/contact-list-item';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { PAGE_METADATA_TITLE_SUFFIX } from '@/utils/constants';
import { findRoleAssigneesAndGroupsAndUsersByContactableRole } from '@/services/role-assignee-service';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contacts' + PAGE_METADATA_TITLE_SUFFIX,
  description: 'List of people that can be contact based on their roles in the church',
};

export default async function ContactsPage({ searchParams }: Readonly<{ searchParams: Promise<{ page?: string; }>; }>) {
  const { page } = await searchParams;

  const assignees = await findRoleAssigneesAndGroupsAndUsersByContactableRole({}, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList 
        items={assignees.data}
        renderItem={(assignee) => <ContactListItem key={assignee.roleAssignees.id} contact={assignee} />}
      />
     
      <PaginationList path="/contacts" pagination={assignees} />
    </section>
  );
}
