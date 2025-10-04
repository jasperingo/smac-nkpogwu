import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/mysql2';

export const database = drizzle({
  logger: true,
  connection: { 
    host: process.env.DATABASE_HOST!,
    database: process.env.DATABASE_NAME!,
    user: process.env.DATABASE_USER!,
    password: process.env.DATABASE_PASSWORD!,
    port: parseInt(process.env.DATABASE_PORT!),
  } 
});

database.execute(sql`SELECT 1`)
  .then(() => console.log('Database connected!!!'))
  .catch(()=> console.error('Database NOT connected!!!'));
