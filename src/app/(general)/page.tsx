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
      <h2 className="text-primary font-bold mb-4 text-xl md:text-2xl">{ heading }</h2>

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

const pagination = resolvePaginationParams(1, 4);

export default async function HomePage() {
  const session = await getSession();

  const [contacts, groups, upcomingPrograms, ongoingPrograms, endedPrograms] = await Promise.all([
    findRoleAssigneesAndGroupsAndUsersByContactableRole({}, resolvePaginationParams(1, 4)),
    findGroupsAndParents(
      { 
        spotlighted: true,
        privacy: session === null ? GroupEntityPrivacy[0] : undefined, 
      }, 
      pagination
    ),
    findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
      { 
        publicOnly: session === null,
        scheduleState: 'upcoming',
      }, 
      pagination
    ),
    findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
      { 
        publicOnly: session === null,
        scheduleState: 'ongoing',
      }, 
      pagination
    ),
    findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators(
      { 
        publicOnly: session === null,
        scheduleState: 'ended',
      }, 
      pagination
    )
  ]);

  const groupsPrograms = await Promise.all(
    groups.data.map((group) => findProgramsAndUsersAndGroupsWithScheduledDatetimesAndSpotlightedCoordinators({ groupId: group.groups.id }, pagination))
  );

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

      {
        upcomingPrograms.totalItems > 0 && (
          <HomePageSection heading="Upcoming programs" seeMoreHref="/programs?scheduleState=upcoming">

            <GenericUnorderedList 
              items={upcomingPrograms.data}
              emptyText="No upcoming program at the moment"
              renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
            />

          </HomePageSection>
        )
      }

      {
        ongoingPrograms.totalItems > 0 && (
          <HomePageSection heading="Ongoing programs" seeMoreHref="/programs?scheduleState=ongoing">

            <GenericUnorderedList 
              items={ongoingPrograms.data}
              emptyText="No ongoing program at the moment"
              renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
            />

          </HomePageSection>
        )
      }

      {
        endedPrograms.totalItems > 0 && (
          <HomePageSection heading="Concluded programs" seeMoreHref="/programs?scheduleState=ended">

            <GenericUnorderedList 
              items={endedPrograms.data}
              emptyText="No concluded program at the moment"
              renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
            />

          </HomePageSection>
        )
      }

      {
        groupsPrograms.map((programs) => {
          if (programs.totalItems === 0) {
            return null;
          }

          return (
            <HomePageSection 
              key={programs.data[0].groups?.id} 
              heading={`${programs.data[0].groups?.name} programs`} 
              seeMoreHref={`/groups/${programs.data[0].groups?.id}/programs`}
            >

              <GenericUnorderedList 
                items={programs.data}
                emptyText={`No ${programs.data[0].groups?.name} program at the moment`}
                renderItem={(program) => <ProgramListItem key={program.programs.id} program={program} />}
              />

            </HomePageSection>
          )
        })
      }

      {
        groups.totalItems > 0 && (
          <HomePageSection heading="Groups" seeMoreHref="/groups">

            <GenericUnorderedList 
              items={groups.data}
              emptyText="No group at the moment"
              renderItem={(group) => <GroupListItem key={group.groups.id} group={group} />}
            />

          </HomePageSection>
        )
      }

      {
        contacts.totalItems > 0 && (
          <HomePageSection heading="People to contact" seeMoreHref="/contacts">

            <GenericUnorderedList 
              items={contacts.data}
              emptyText="No person to contact at the moment"
              renderItem={(contact) => <ContactListItem key={contact.roleAssignees.id} contact={contact} />}
            />

          </HomePageSection>
        )
      }
    </>
  );
}
