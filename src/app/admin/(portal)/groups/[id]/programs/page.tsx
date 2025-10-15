import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramsByGroupId } from '@/services/program-service';

export default async function AdminGroupProgramsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const programs = await findProgramsByGroupId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">
      
      <MenuList items={[ { href: `/admin/programs/create?groupId=${id}`, text: 'Add program' } ]} />

      <GenericTable
        headings={[ 'ID', 'Name', 'Theme', 'Topic', 'Action' ]}
        items={programs.data}
        renderItem={(program) => (
          <tr key={program.id}>
            <td className="p-2 border">{ program.id }</td>
            <td className="p-2 border">{ program.name }</td>
            <td className="p-2 border">{ program.theme ?? '(Not set)' }</td>
            <td className="p-2 border">{ program.topic ?? '(Not set)' }</td>
            <td className="p-2 border">
              <ActionLink href={`/admin/programs/${program.id}`}>Details</ActionLink>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/groups/${id}/programs`} pagination={programs} />

    </section>
  );
}
