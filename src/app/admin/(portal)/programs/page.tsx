import MenuList from '@/components/menu-list';
import SearchForm from '@/components/search-form';

export default async function AdminProgramsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string }> }) {
  const { page, search } = await searchParams;

  return (
    <section className="bg-foreground p-4">

      <MenuList items={[ { href: 'programs/create', text: 'Add program' } ]} />

      <SearchForm value={search} action="/admin/programs" placeholder="Search by ID or Name" />
      

    </section>
  );
}
