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
            term: 'Name', 
            displayRow: true,
            details: groups.name, 
          },
          { 
            term: 'Description', 
            displayRow: false,
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

    </section>
  );
}
