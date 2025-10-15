import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import SearchForm from '@/components/search-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramsAndUsersAndGroups } from '@/services/program-service';

export default async function AdminProgramsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  const programs = await findProgramsAndUsersAndGroups(search?.length === 0 ? null : (search ?? null), resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'programs/create', text: 'Add program' } ]} />

      <SearchForm value={search} action="/admin/programs" placeholder="Search by ID or Name" />
      
      <GenericTable
        items={programs.data}
        headings={[ 'ID', 'Name', 'Theme', 'Topic', 'User', 'Group', 'Action' ]}
        renderItem={(program) => (
          <tr key={program.programs.id}>
            <td className="p-2 border">{ program.programs.id }</td>
            <td className="p-2 border">{ program.programs.name }</td>
            <td className="p-2 border">{ program.programs.theme ?? '(Not set)' }</td>
            <td className="p-2 border">{ program.programs.topic ?? '(Not set)' }</td>
            <td className="p-2 border">{ program.users ? `${program.users.firstName} ${program.users.lastName}` : '(Not set)' }</td>
            <td className="p-2 border">{ program.groups ? program.groups.name : '(Not set)' }</td>
            <td className="p-2 border">
              <ActionLink href={`/admin/programs/${program.programs.id}`}>Details</ActionLink>
            </td>
          </tr>
        )}
      />

      <PaginationList path="/admin/programs" pagination={programs} params={new Map([['search', search]])} />
    </section>
  );
}
