import Link from 'next/link';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import SimpleDescriptionList from '@/components/simple-description-list';
import { getDisplayDatetime } from '@/utils/datetime';
import { resolvePaginationParams } from '@/utils/pagination';
import { findProgramCoordinatorsAndProgramSchedulesAndProgramsByUserId } from '@/services/program-coordinator-service';

export default async function UserProgramCoordinationsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;

  const coordinations = await findProgramCoordinatorsAndProgramSchedulesAndProgramsByUserId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">
      <GenericUnorderedList 
        items={coordinations.data}
        renderItem={(coordination) => (
          <li key={coordination.programCoordinators.id}>
            <Link href={`/programs/${coordination.programs?.id}`} className="block border p-2">
              <SimpleDescriptionList
                items={[
                  { 
                    term: 'Program', 
                    displayRow: true,
                    details: coordination.programs?.name, 
                  },
                  { 
                    term: 'Role', 
                    displayRow: true,
                    details: coordination.programCoordinators.role, 
                  },
                  { 
                    term: 'Start date', 
                    displayRow: true,
                    details: coordination.programSchedules?.startDatetime ? getDisplayDatetime(coordination.programSchedules?.startDatetime) : '(Not set)', 
                  },
                  { 
                    term: 'End date', 
                    displayRow: true,
                    details: coordination.programSchedules?.endDatetime ? getDisplayDatetime(coordination.programSchedules?.endDatetime) : '(Not set)', 
                  },
                ]} 
              />
            </Link>
          </li>
        )}
      />
     
      <PaginationList path={`/users/${id}/program-coordinations`} pagination={coordinations} />
    </section>
  );
}
