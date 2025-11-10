import Image from 'next/image';
import { UserDefaultImage } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import SimpleDescriptionList from '@/components/simple-description-list';
import { findRoleAssigneesAndGroupsAndUsersByContactableRole } from '@/services/role-assignee-service';

export default async function ContactsPage({ searchParams }: Readonly<{ searchParams: Promise<{ page?: string; }>; }>) {
  const { page } = await searchParams;

  const assignees = await findRoleAssigneesAndGroupsAndUsersByContactableRole(resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericUnorderedList 
        items={assignees.data}
        renderItem={(assignee) => (
          <li key={assignee.roleAssignees.id} className="mb-4 md:mb-0">
            <div className="border p-2 flex gap-2 items-start">
              <Image
                src={assignee.users?.imageUrl ?? UserDefaultImage} 
                alt={`${assignee.roleAssignees.id} image`} 
                width="64" 
                height="64" 
                className="block w-16 h-16 border border-gray-400 rounded-full" 
              />

              <div>
                <SimpleDescriptionList
                  items={[
                    { 
                      term: 'Role', 
                      details: `${assignee.groups ? `${assignee.groups.name} - ` : ''}${assignee.roles?.name}`, 
                      displayRow: true
                    },
                    { 
                      term: 'Name', 
                      details: `${assignee.users?.title ?? ''} ${assignee.users?.firstName} ${assignee.users?.lastName}`, 
                      displayRow: true 
                    },
                    { 
                      term: 'Email', 
                      displayRow: true,
                      details: assignee.users?.emailAddress 
                        ? <a href={`mailto:${assignee.users?.emailAddress}`} target="_blank">{ assignee.users?.emailAddress }</a> 
                        : '(Not set)', 
                    },
                    { 
                      term: 'Phone', 
                      displayRow: true,
                      details: assignee.users?.phoneNumber 
                        ? <a href={`tel:${assignee.users?.phoneNumber}`} target="_blank">{ assignee.users?.phoneNumber }</a>
                        : '(Not set)', 
                    },
                  ]} 
                />
              </div>
            </div>
          </li>
        )}
      />
     
      <PaginationList path="/contacts" pagination={assignees} />
    </section>
  );
}
