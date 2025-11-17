import PaginationList from '@/components/pagination-list';
import ContactListItem from '@/components/contact-list-item';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findRoleAssigneesAndGroupsAndUsersByContactableRole } from '@/services/role-assignee-service';

export default async function SearchContactsPage({ searchParams }: Readonly<{ searchParams: Promise<{ search?: string; page?: string; }>; }>) {
  const { search, page } = await searchParams;

  const assignees = await findRoleAssigneesAndGroupsAndUsersByContactableRole({ search }, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList 
        items={assignees.data}
        renderItem={(assignee) => <ContactListItem key={assignee.roleAssignees.id} contact={assignee} />}
      />
     
      <PaginationList path="/search/contacts" pagination={assignees} params={new Map([['search', search]])} />
    </section>
  );
}
