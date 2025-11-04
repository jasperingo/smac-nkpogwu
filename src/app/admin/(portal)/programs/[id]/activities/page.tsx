import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import SimpleDescriptionList from '@/components/simple-description-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramActivitiesByProgramScheduleId } from '@/services/program-activity-service';
import { findFirstProgramScheduleByProgramId, findProgramScheduleByIdAndProgramId } from '@/services/program-schedule-service';

export default async function AdminProgramActivitiesPage(
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

        <div className="font-bold">No schedule in this program. You have to add a schedule before you can add activitites</div>
      
      </section>
    );
  }

  const activities = await findProgramActivitiesByProgramScheduleId(schedule.id, resolvePaginationParams(page));

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

      <MenuList items={[ { href: `activities/create?sid=${schedule.id}`, text: 'Add activity' } ]} />
      
      <GenericTable
        headings={['ID', 'Order', 'Name', 'Description', 'Actions']}
        items={activities.data}
        renderItem={(activity, index) => (
          <tr key={activity.id}>
            <td className="p-2 border">{ activity.id }</td>
            <td className="p-2 border">{ (index * activities.currentPage) + 1 }</td>
            <td className="p-2 border">{ activity.name }</td>
            <td className="p-2 border">{ activity.description ?? '(Not set)' }</td>
            <td className="p-2 border">
              <div className="flex gap-2 flex-wrap">
                <ActionLink href={`/admin/programs/${id}/activities/${activity.id}`}>Update</ActionLink>
                <ActionLink href={`/admin/programs/${id}/activities/${activity.id}/delete`}>Delete</ActionLink>
              </div>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/programs/${id}/activities`} pagination={activities} params={new Map([['sid', schedule.id.toString()]])} />
    </section>
  );
}
