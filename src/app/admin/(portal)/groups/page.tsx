import MenuList from "@/components/menu-list";

export default async function AdminGroupsPage() {


  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'groups/create', text: 'Add group' } ]} />

    </section>
  );
}
