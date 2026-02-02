import { getSession } from '@/utils/session';
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

  const session = await getSession();

  if (session === null) {
    return null;
  }

  const notUserProfile = session.userId !== user.id;

  return (
    <section className="bg-foreground p-4">
      
      <SimpleDescriptionList
        items={[
          { 
            term: 'Title', 
            displayRow: true, 
            details: user.title ?? '(Not set)', 
            remove: notUserProfile && user.title === null,
          },
          { term: 'First name', details: user.firstName, displayRow: true },
          { term: 'Last name', details: user.lastName, displayRow: true },
          { 
            term: 'Other name', 
            displayRow: true, 
            details: user.otherName ?? '(Not set)', 
            remove: notUserProfile && user.otherName === null,
          },
          { term: 'Gender', details: user.gender, displayRow: true },
          { 
            term: 'Date of Birth', 
            displayRow: true, 
            remove: notUserProfile && user.dateOfBirth === null,
            details: user.dateOfBirth?.toLocaleDateString('en-GB', { month: 'long', day: 'numeric', weekday: 'long' }) ?? '(Not set)', 
          },
          { term: 'Email', details: user.emailAddress ?? '(Not set)', displayRow: true, remove: notUserProfile },
          { term: 'Phone', details: user.phoneNumber ?? '(Not set)', displayRow: true, remove: notUserProfile },
          { 
            term: 'Membership number', 
            displayRow: true, 
            details: user.membershipNumber ?? '(Not set)', 
            remove: notUserProfile && user.membershipNumber === null,
          },
          { 
            term: 'Membership date', 
            displayRow: true, 
            remove: notUserProfile && user.membershipStartDatetime === null,
            details: user.membershipStartDatetime?.toLocaleString() ?? '(Not set)', 
          },
        ]} 
      />
      
    </section>
  );
}
