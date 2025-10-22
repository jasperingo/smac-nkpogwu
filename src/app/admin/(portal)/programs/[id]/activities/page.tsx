import { Search } from 'lucide-react';
import MenuList from '@/components/menu-list';
import ActionLink from '@/components/action-link';
import GenericTable from '@/components/generic-table';
import PaginationList from '@/components/pagination-list';
import { resolvePaginationParams } from '@/utils/pagination';
import { findAllProgramSchedulesByProgramId } from '@/services/program-schedule-service';

export default async function AdminProgramActivitiesPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ sid?: string; page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { sid, page } = await searchParams;
  
  const schedules = await findAllProgramSchedulesByProgramId(id);

  const scheduleId = !sid || isNaN(Number(sid)) ? (schedules[0]?.id ?? null) : Number(sid);

  if (scheduleId === null) {
    return (
      <section className="bg-foreground p-4">

        <div className="font-bold">No schedule in this program. You have to add a schedule before you can add activitites</div>
      
      </section>
    );
  }

  return (
    <section className="bg-foreground p-4">

      <form action="activities" className="my-4 border p-2">
        <select 
          name="sid" 
          id="sid-input"
          defaultValue={scheduleId}
          className="block mb-2 w-full p-2 outline-0 border border-primary"
        >
          {
            schedules.map((option) => (
              <option key={option.id} value={option.id}>
                { option.startDatetime.toLocaleString() } -  { option.endDatetime.toLocaleString() }
              </option>
            ))
          }
        </select>
        
        <div className="text-right">
          <button 
            type="submit" 
            className="px-4 py-1 align-middle text-center text-on-primary border border-primary bg-primary hover:bg-primary-variant"
          >
            <Search className="inline" />
            &nbsp;&nbsp;
            <span>Search schedule</span>
          </button>
        </div>
      </form>

      <MenuList items={[ { href: `activities/create?sid=${scheduleId}`, text: 'Add activity' } ]} />
      
      
    </section>
  );
}
