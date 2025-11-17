import Link from 'next/link';
import Image from 'next/image';
import PaginationList from '@/components/pagination-list';
import GenericUnorderedList from '@/components/generic-unordered-list';
import SimpleDescriptionList from '@/components/simple-description-list';
import { ProgramDefaultImage } from '@/models/entity';
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
            <Link href={`/programs/${coordination.programs?.id}`} className="border p-2 flex gap-2 items-start">
              <Image 
                width="64" 
                height="64" 
                className="h-16 w-16 md:w-24 md:h-24"
                alt={`${coordination.programs?.id} image`} 
                src={coordination.programs?.imageUrl ?? ProgramDefaultImage} 
              />
              
              <div>
                <SimpleDescriptionList
                  items={[
                    { 
                      term: 'Program', 
                      details: coordination.programs?.name, 
                      displayRow: true
                    },
                    { 
                      term: 'Role', 
                      details: coordination.programCoordinators.role, 
                      displayRow: true
                    },
                    { 
                      term: 'Start date', 
                      details: coordination.programSchedules?.startDatetime?.toLocaleString(), 
                      displayRow: true
                    },
                    { 
                      term: 'End date', 
                      details: coordination.programSchedules?.endDatetime?.toLocaleString(), 
                      displayRow: true
                    },
                    { 
                      term: 'Status', 
                      displayRow: true,
                      details: (
                        (coordination.programSchedules?.endDatetime.getTime() ?? 0) < Date.now() 
                          ? <div className="w-fit px-2 py-1 text-sm bg-gray-600 text-white">Ended</div> 
                          : (coordination.programSchedules?.startDatetime.getTime() ?? 0) > Date.now()
                            ? <div className="w-fit px-2 py-1 text-sm bg-blue-600 text-white">Upcoming</div> 
                            : <div className="w-fit px-2 py-1 text-sm bg-green-600 text-white">On going</div> 
                      ), 
                    },
                  ]} 
                />
              </div>
            </Link>
          </li>
        )}
      />
     
      <PaginationList path={`/users/${id}/program-coordinations`} pagination={coordinations} />
    </section>
  );
}
