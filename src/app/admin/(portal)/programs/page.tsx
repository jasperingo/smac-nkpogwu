import Link from 'next/link';
import MenuList from '@/components/menu-list';
import SearchForm from '@/components/search-form';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { findPrograms } from '@/services/program-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminProgramsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  const programs = await findPrograms(search?.length === 0 ? null : (search ?? null), resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'programs/create', text: 'Add program' } ]} />

      <SearchForm value={search} action="/admin/programs" placeholder="Search by ID or Name" />
      
      <GenericTable
        items={programs.data}
        headings={[ 'ID', 'Name', 'Theme', 'Topic', 'Action' ]}
        renderItem={(program) => (
          <tr key={program.id}>
            <td className="p-2 border">{ program.id }</td>
            <td className="p-2 border">{ program.name }</td>
            <td className="p-2 border">{ program.theme ?? '(Not set)' }</td>
            <td className="p-2 border">{ program.topic ?? '(Not set)' }</td>
            <td className="p-2 border">
              <Link 
                href={`/admin/programs/${program.id}`}
                className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
              >Details</Link>
            </td>
          </tr>
        )}
      />

      <PaginationList path="/admin/programs" pagination={programs} params={new Map([['search', search]])} />
    </section>
  );
}
