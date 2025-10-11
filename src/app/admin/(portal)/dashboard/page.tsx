import AdminPageHeading from '@/components/admin-page-heading';

export default async function AdminDashboardPage() {
  
  await new Promise((resolve) => setTimeout(resolve, 2000)); // TODO: remove

  return (
    <section className="bg-foreground p-4">
      Dashboard

    </section>
  );
}
