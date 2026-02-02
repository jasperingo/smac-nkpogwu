import { cache } from 'react';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getSession } from '@/utils/session';
import { PAGE_METADATA_TITLE_SUFFIX } from '@/utils/constants';
import ProgramStateDiv from '@/components/program-state-div';
import ItemPageTopDetails from '@/components/item-page-top-details';
import { GroupEntityPrivacy, ProgramDefaultImage } from '@/models/entity';
import { findProgramAndUserAndGroupById } from '@/services/program-service';
import { findFirstAndLastProgramScheduleByProgramId } from '@/services/program-schedule-service';

const cachedFindProgramAndUserAndGroupById = cache(findProgramAndUserAndGroupById);

export async function generateMetadata( { params }: Readonly<{ params: Promise<{ id: string }>; }>): Promise<Metadata> {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return {};
  }

  const program = await cachedFindProgramAndUserAndGroupById(id);

  if (program === null) {
    return {};
  }

  return {
    title: program.programs.name + PAGE_METADATA_TITLE_SUFFIX,
    description: 'Program details for ' + program.programs.name,
  }
}

export default async function ProgramLayout({ params, children }: Readonly<{ params: Promise<{ id: string }>; children: React.ReactNode; }>) {
  const session = await getSession();

  const id = Number((await params).id);

  if (isNaN(id)) {
    notFound();
  }

  const program = await cachedFindProgramAndUserAndGroupById(id);

  if (program === null) {
    notFound();
  }

  if (session === null && (program.users !== null || (program.groups !== null && program.groups.privacy === GroupEntityPrivacy[1]))) {
    redirect('/sign-in')
  }

  const [firstSchedule, lastSchedule] = await findFirstAndLastProgramScheduleByProgramId(program.programs.id);

  return (
    <>
      <ItemPageTopDetails title={program.programs.name} imageUrl={program.programs.imageUrl ?? ProgramDefaultImage}>
      
        <div className="mt-2 flex justify-center">
          <ProgramStateDiv startDatetime={firstSchedule?.startDatetime} endDatetime={lastSchedule?.endDatetime} />   
        </div>
   
      </ItemPageTopDetails>

      { children }
    </>
  );
}
