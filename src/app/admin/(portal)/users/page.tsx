import AdminPageHeading from '@/components/admin-page-heading';

export default async function AdminUsersPage() {
  
  await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: remove

  return (
    <section className="bg-foreground p-4">
      <AdminPageHeading text="Users" />

    </section>
  );
}
