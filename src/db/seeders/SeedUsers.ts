import { db } from '../drizzle.config'; // Import your database instance
import { users } from '../schemas/UserSchema';
import { eq } from 'drizzle-orm';

const userData = [
  {
    name: 'Tony',
    surname: 'Stark',
    email: 'tony.start@slipsam.com',
    password: '$2b$10$sOp8iMJH/kkUe38K2yquEOhVumcROz7V4mnR3DepRUc9tZTTXHZQC', // 1234
    phone: '0712345678',
    role: 'individual',
    status: 'Active',
    idNum: '8746537847653',
  },
  {
    name: 'Steve',
    surname: 'Roger',
    email: 'steve.rogers@slipsam.com',
    password: '$2b$10$sOp8iMJH/kkUe38K2yquEOhVumcROz7V4mnR3DepRUc9tZTTXHZQC', // 1234
    phone: '0712345678',
    role: 'Company',
    status: 'Active',
    idNum: '8746537847653',
  },
];

async function seedUsers() {
  try {
    for (const user of userData) {
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.idNum, user.idNum));

      if (existingUser.length === 0) {
        await db.insert(users).values(user);
        console.log(`User ${user.idNum} inserted.`);
      } else {
        console.log(`User ${user.idNum} already exists.`);
      }
    }

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

seedUsers().then(() => process.exit());