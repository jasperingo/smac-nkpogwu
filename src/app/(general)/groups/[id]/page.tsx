import Link from 'next/link';
import { findGroupAndParentById } from '@/services/group-service';
import SimpleDescriptionList from '@/components/simple-description-list';

export default async function GroupPage({ params }: Readonly<{ params: Promise<{ id: string }>; }>) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return null;
  }
  
  const group = await findGroupAndParentById(id);

  if (group === null) {
    return null;
  }

  const { groups, parent } = group;
  
  return (
    <section className="bg-foreground p-4">

      <SimpleDescriptionList
        itemsSpacing="md"
        items={[
          { 
            term: 'Description', 
            displayRow: false,
            remove: groups.description === null,
            details: groups.description ? (<p className="whitespace-pre-wrap">{ groups.description }</p>) : '(Not set)', 
          },
          { 
            term: 'Parent', 
            displayRow: false, 
            remove: parent === null,
            details: (<Link href={`/groups/${parent?.id}`} className="inline-block p-2 border">{ parent?.name }</Link>), 
          },
        ]} 
      />

      {
        groups.description === null && parent === null && (
          <div className="p-2 bg-gray-200">
            <div>No details to show at the moment</div>
            <div>You can check out the programs, sub groups, or members of this group</div>
          </div>
        )
      }

    </section>
  );
}
