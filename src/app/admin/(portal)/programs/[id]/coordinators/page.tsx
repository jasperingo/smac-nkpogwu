import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import SimpleDescriptionList from '@/components/simple-description-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramCoordinatorsAndUsersByProgramScheduleId } from '@/services/program-coordinator-service';
import { findFirstProgramScheduleByProgramId, findProgramScheduleByIdAndProgramId } from '@/services/program-schedule-service';

export default async function AdminProgramCordinatorsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ sid?: string; page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { sid, page } = await searchParams;
  
  const searchScheduleId = Number(sid);

  const schedule = await (!isNaN(searchScheduleId) ? findProgramScheduleByIdAndProgramId(searchScheduleId, id) : findFirstProgramScheduleByProgramId(id));

  if (schedule === null) {
    if (sid) {
       return (
        <section className="bg-foreground p-4">

          <div className="font-bold">Invalid schedule ID provided: { sid }</div>
        
        </section>
      );
    }

    return (
      <section className="bg-foreground p-4">

        <div className="font-bold">No schedule in this program. You have to add a schedule before you can add coordinators</div>
      
      </section>
    );
  }

  const coordinators = await findProgramCoordinatorsAndUsersByProgramScheduleId(schedule.id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <SimpleDescriptionList
        insideForm
        caption="Program schedule"
        items={[
          { term: 'ID', details: schedule.id, displayRow: true },
          { term: 'Start date', details: schedule.startDatetime.toLocaleString(), displayRow: true },
          { term: 'End date', details: schedule.endDatetime.toLocaleString(), displayRow: true },
          { term: 'Topic', details: schedule.topic ?? '(Not set)', displayRow: true },
        ]} 
      />

      <MenuList
        items={[ 
          { href: `coordinators/create?sid=${schedule.id}`, text: 'Add registered coordinator' },
          { href: `coordinators/create/guest?sid=${schedule.id}`, text: 'Add guest coordinator' },
        ]} 
      />
      
      <GenericTable
        headings={['ID', 'Role', 'Is Guest', 'Name', 'Spotlighted', 'Actions']}
        items={coordinators.data}
        renderItem={(coordinator) => (
          <tr key={coordinator.programCoordinators.id}>
            <td className="p-2 border">{ coordinator.programCoordinators.id }</td>
            <td className="p-2 border">{ coordinator.programCoordinators.role }</td>
            <td className="p-2 border">{ coordinator.users === null ? 'Yes' : 'No' }</td>
            <td className="p-2 border">
              { coordinator.programCoordinators.name ?? (coordinator.users ? `${coordinator.users.firstName} ${coordinator.users.lastName}` : '') }
            </td>
            <td className="p-2 border">{ coordinator.programCoordinators.spotlighted ? 'Yes' : 'No' }</td>
            <td className="p-2 border">
              <ActionLink href={`/admin/programs/${id}/coordinators/${coordinator.programCoordinators.id}`}>Delete</ActionLink>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/programs/${id}/coordinators`} pagination={coordinators} params={new Map([['sid', schedule.id.toString()]])} />
    </section>
  );
}
