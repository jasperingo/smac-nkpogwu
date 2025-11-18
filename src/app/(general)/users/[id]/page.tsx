import { findUserById } from '@/services/user-service';
import SimpleDescriptionList from '@/components/simple-description-list';

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  if (isNaN(id)) {
    return null;
  }
  
  const user = await findUserById(id);

  if (user === null) {
    return null;
  }

  return (
    <section className="bg-foreground p-4">
      
      <SimpleDescriptionList
        items={[
          { term: 'Title', details: user.title ?? '(Not set)', displayRow: true },
          { term: 'First name', details: user.firstName, displayRow: true },
          { term: 'Last name', details: user.lastName, displayRow: true },
          { term: 'Other name', details: user.otherName ?? '(Not set)', displayRow: true },
          { term: 'Gender', details: user.gender, displayRow: true },
          { term: 'Date of Birth', details: user.dateOfBirth?.toLocaleDateString()?.substring(0, 5) ?? '(Not set)', displayRow: true },
          { term: 'Email', details: user.emailAddress ?? '(Not set)', displayRow: true },
          { term: 'Phone', details: user.phoneNumber ?? '(Not set)', displayRow: true },
          { term: 'Membership number', details: user.membershipNumber ?? '(Not set)', displayRow: true },
          { term: 'Membership date', details: user.membershipStartDatetime?.toLocaleString() ?? '(Not set)', displayRow: true },
        ]} 
      />
      
    </section>
  );
}
