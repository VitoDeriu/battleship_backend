import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

const roundOfHashing = 10;

async function main() {

  //create admin user
  const passwordAdmin = await bcrypt.hash('kantin', roundOfHashing);
  const user1 = await prisma.users.upsert({
    where: { email: 'admin@battleship.com' },
    update: {
      password: passwordAdmin
    },
    create: {
      firstname: 'Admin',
      lastname: 'BattleShip',
      username: 'admin_battleship',
      email: 'admin@battleship.com',
      password: passwordAdmin,
      is_admin: true,
      profile_picture: null
    },
  });
  const passwordUser = await bcrypt.hash('password', roundOfHashing);
  const user2 = await prisma.users.upsert({
    where: { email: 'user@battleship.com' },
    update: {
      password: passwordUser
    },
    create: {
      firstname: 'User',
      lastname: 'BattleShip',
      username: 'user_battleship',
      email: 'user@battleship.com',
      password: passwordUser,
      is_admin: false,
      profile_picture: null
    }
  })
  console.log({ user1, user2});
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

