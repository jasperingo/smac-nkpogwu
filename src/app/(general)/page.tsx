import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { getSession } from '@/utils/session';
import { GroupEntityPrivacy } from '@/models/entity';
import { resolvePaginationParams } from '@/utils/pagination';
import { findGroupsAndParents } from '@/services/group-service';
import GroupListItem from '@/components/group-list-item';
import ProgramListItem from '@/components/program-list-item';
import ContactListItem from '@/components/contact-list-item';
import GenericUnorderedList from '@/components/generic-unordered-list';
import { findRoleAssigneesAndGroupsAndUsersByContactableRole } from '@/services/role-assignee-service';
import { findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators } from '@/services/program-service';

export function HomePageSection({ heading, seeMoreHref, children }: { heading: string; seeMoreHref?: string; children: React.ReactNode; }) {
  return (
    <section className="mb-8 bg-foreground p-4">
      <h2 className="font-bold mb-2 text-lg md:text-xl">{ heading }</h2>

      { children }

      {
        seeMoreHref && (
          <Link 
            href={seeMoreHref}
            className="flex gap-2 items-center w-fit mt-4 p-2 border border-primary bg-primary text-on-primary hover:bg-primary-variant"
          >
            <span>See more</span>
            <ChevronRight />
          </Link>
        )
      }
    </section>
  );
}

export default async function HomePage() {
  const session = await getSession();

  const groups = await findGroupsAndParents(
    { 
      spotlighted: true,
      privacy: session === null ? GroupEntityPrivacy[0] : undefined, 
    }, 
    resolvePaginationParams(1, 4)
  );

  const upcomingPrograms = await findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
    { 
      publicOnly: session === null,
      scheduleState: 'upcoming',
    }, 
    resolvePaginationParams(1, 4)
  );

  const ongoingPrograms = await findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
    { 
      publicOnly: session === null,
      scheduleState: 'ongoing',
    }, 
    resolvePaginationParams(1, 4)
  );

  const endedPrograms = await findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
    { 
      publicOnly: session === null,
      scheduleState: 'ended',
    }, 
    resolvePaginationParams(1, 4)
  );

  const contacts = await findRoleAssigneesAndGroupsAndUsersByContactableRole({}, resolvePaginationParams(1, 4));

  return (
    <>
      <section className="mb-8 relative">
        <Image
          width="300" 
          height="300" 
          className="block w-full h-80"
          src="/images/home-hero.jpg"
          alt="Hero iamge of church building"
        />

        <div className="p-8 absolute top-0 left-0 w-full h-80 bg-black/[.4] text-white flex flex-col justify-center">

          <div className="container">

            <h2 className="text-4xl font-bold mb-2 lg:text-6xl">The Flame of the Anglican Revival</h2>

            <h2 className="text-xl font-bold lg:text-2xl">Diocese of Niger Delta North</h2>

          </div>

        </div>
      </section>

      <HomePageSection heading="Upcoming programs" seeMoreHref="/programs?scheduleState=upcoming">

        <GenericUnorderedList 
          items={upcomingPrograms.data}
          emptyText="No upcoming program at the moment"
          renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
        />

      </HomePageSection>

      <HomePageSection heading="Ongoing programs" seeMoreHref="/programs?scheduleState=ongoing">

        <GenericUnorderedList 
          items={ongoingPrograms.data}
          emptyText="No ongoing program at the moment"
          renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
        />

      </HomePageSection>

      <HomePageSection heading="Just concluded programs" seeMoreHref="/programs?scheduleState=ended">

        <GenericUnorderedList 
          items={endedPrograms.data}
          emptyText="No just concluded program at the moment"
          renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
        />

      </HomePageSection>

      <HomePageSection heading="Groups" seeMoreHref="/groups">

        <GenericUnorderedList 
          items={groups.data}
          emptyText="No group at the moment"
          renderItem={(group) => <GroupListItem key={group.groups.id} group={group} />}
        />

      </HomePageSection>

      <HomePageSection heading="People to contact" seeMoreHref="/contacts">

        <GenericUnorderedList 
          items={contacts.data}
          emptyText="No person to contact at the moment"
          renderItem={(contact) => <ContactListItem key={contact.roleAssignees.id} contact={contact} />}
        />

      </HomePageSection>
    </>
  );
}
