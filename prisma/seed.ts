// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize Prisma Client
const prisma = new PrismaClient();

const roundOfHashing = 10;

async function main() {

  //create admin user
  const password = await bcrypt.hash('kantin', roundOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'admin@battleship.com' },
    update: {
      password: password
    },
    create: {
      email: 'admin@battleship.com',
      name: 'Admin',
      password: password,
    },
  });

  // create a dummy article
  const post1 = await prisma.article.upsert({
    where: { title: 'Prisma Adds Support for MongoDB' },
    update: {
      authorId: user1.id,
    },
    create: {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
      authorId: user1.id,
    },
  });

  console.log({ user1, post1});
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
