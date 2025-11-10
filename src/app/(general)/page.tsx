import Link from 'next/link';
import { usersTable } from '@/database/schema';
import { database } from '@/database/connection';

export default async function GeneralHomePage() {
  // const users = await database.select().from(usersTable);

  return (
    <>
      <h2>Index page</h2>

      

      {/* <ul>
        {
          users.map((user) => (<li key={user.id}>{ user.id }</li>))
        }
      </ul> */}
    </>
  );
}
