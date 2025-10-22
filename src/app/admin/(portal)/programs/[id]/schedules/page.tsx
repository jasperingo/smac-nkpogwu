import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramSchedulesByProgramId } from '@/services/program-schedule-service';

export default async function AdminProgramSchedulesPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;

  const schedules = await findProgramSchedulesByProgramId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">
      
      <MenuList items={[ { href: 'schedules/create', text: 'Add schedule' } ]} />

      <GenericTable
        headings={['ID', 'Start', 'End', 'Topic', 'Link', 'Actions']}
        items={schedules.data}
        renderItem={(schedule) => (
          <tr key={schedule.id}>
            <td className="p-2 border">{ schedule.id }</td>
            <td className="p-2 border">{ schedule.startDatetime.toLocaleString() }</td>
            <td className="p-2 border">{ schedule.endDatetime.toLocaleString() }</td>
            <td className="p-2 border">{ schedule.topic ?? '(Not set)' }</td>
            <td className="p-2 border">{ schedule.link ? <a href={schedule.link} target="_blank" className="text-blue-600">{ schedule.link }</a> : '(Not set)' }</td>
            <td className="p-2 border">
              <div className="flex gap-2 flex-wrap">
                <ActionLink href={`/admin/programs/${id}/schedules/${schedule.id}/update`}>Update</ActionLink>
                <ActionLink href={`/admin/programs/${id}/schedules/${schedule.id}/delete`}>Delete</ActionLink>
              </div>
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/programs/${id}/schedules`} pagination={schedules} />
    </section>
  );
}
