import GenericTable from '@/components/generic-table';
import MenuList from '@/components/menu-list';
import PaginationList from '@/components/pagination-list';
import { findGroupsByParentId } from '@/services/group-service';
import { resolvePaginationParams } from '@/utils/pagination';

export default async function AdminGroupGroupsPage(
  { params, searchParams }: Readonly<{ params: Promise<{ id: string }>; searchParams: Promise<{ page?: string; }>; }>
) {
  const id = Number((await params).id);

  const { page } = await searchParams;
  
  const groups = await findGroupsByParentId(id, resolvePaginationParams(page));

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: `/admin/groups/create?parentId=${id}`, text: 'Add group' } ]} />

      <GenericTable
        headings={[ 'ID', 'Name', 'Privacy', 'Spotlight', 'Action' ]}
        items={groups.data}
        renderItem={(group) => (
          <tr key={group.id}>
            <td className="p-2 border">{ group.id }</td>
            <td className="p-2 border">{ group.name }</td>
            <td className="p-2 border">{ group.privacy }</td>
            <td className="p-2 border">{ group.spotlighted ? 'Yes' : 'No' }</td>
            <td className="p-2 border">
              {/* <Link 
                href={`/admin/groups/${group.id}`}
                className="text-sm py-1 px-2 bg-primary text-on-primary hover:bg-primary-variant"
              >Profile</Link> */}
            </td>
          </tr>
        )}
      />

      <PaginationList path={`/admin/groups/${id}/sub-groups`} pagination={groups} />

    </section>
  );
}
