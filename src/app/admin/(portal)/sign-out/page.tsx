import AdminPageHeading from '@/components/admin-page-heading';

export default async function AdminSignOutPage() {
  
  await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: remove

  return (
    <section className="bg-foreground p-4 md:w-96 md:mx-auto">
      <AdminPageHeading text="Sign out" />

    </section>
  );
}
