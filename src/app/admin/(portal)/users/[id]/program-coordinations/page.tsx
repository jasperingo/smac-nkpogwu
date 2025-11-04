import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramCoordinatorsAndProgramSchedulesAndProgramsByUserId } from '@/services/program-coordinator-service';

export default async function AdminUserProgramCoordinationsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const coordinations = await findProgramCoordinatorsAndProgramSchedulesAndProgramsByUserId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <GenericTable
        headings={[ 'ID', 'Program name', 'Start date', 'End date', 'Role', 'Action' ]}
        items={coordinations.data}
        renderItem={(coordination) => (
          <tr key={coordination.programCoordinators.id}>
            <td className="p-2 border">{ coordination.programCoordinators.id }</td>
            <td className="p-2 border">{ coordination.programs?.name }</td>
            <td className="p-2 border">{ coordination.programSchedules?.startDatetime?.toLocaleString() }</td>
            <td className="p-2 border">{ coordination.programSchedules?.endDatetime?.toLocaleString() }</td>
            <td className="p-2 border">{ coordination.programCoordinators.role }</td>
            <td className="p-2 border">
              <ActionLink href={`/admin/programs/${coordination.programs?.id}`}>Program details</ActionLink>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/users/${id}/program-coordinations`} pagination={coordinations} />

    </section>
  );
}
