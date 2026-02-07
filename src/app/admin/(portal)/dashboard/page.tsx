import { countAllRoles } from '@/services/role-service';
import { countAllUsers } from '@/services/user-service';
import { countAllGroups } from '@/services/group-service';
import { countAllPrograms } from '@/services/program-service';

function DescriptionListItem({ term, detail }: { term: string; detail: string | number; }) {
  return (
    <div className="border text-center py-4 px-2">
      <dd className="font-bold text-2xl">{ detail }</dd>
      <dt>{ term }</dt>
    </div>
  );
}

export const dynamic = 'force-dynamic';

/**
 * Count programs in progress
 * Count programs not started
 * Count programs ended
 * Count unassigned roles
 * Count empty groups
 * Count programs with no schedule
 */
export default async function AdminDashboardPage() {
  const usersCount = await countAllUsers();

  const groupsCount = await countAllGroups();

  const rolesCount = await countAllRoles();

  const programsCount = await countAllPrograms();

  return (
    <section className="bg-foreground p-4">
      
      <dl className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <DescriptionListItem term="Number of users" detail={usersCount} />
        <DescriptionListItem term="Number of groups" detail={groupsCount} />
        <DescriptionListItem term="Number of roles" detail={rolesCount} />
        <DescriptionListItem term="Number of programs" detail={programsCount} />
      </dl>

    </section>
  );
}
