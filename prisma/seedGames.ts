//seed prisma pour la table Games a exec après seedUsers
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function game() {

  const user1 = await prisma.users.findUnique({
    where: { email: 'admin@battleship.com' },
  });

  const user2 = await prisma.users.findUnique({
    where: { email: 'user@battleship.com' },
  });

  if (!user1 || !user2) {
    throw new Error('Users not found. Make sure to run seedUsers.ts first.');
  }

  const boardTest = require('./boardTest.json');

  const game1 = await prisma.games.create({
      data: {
        player1: { connect : {id: user1.id}},
        player2: { connect : {id: user2.id}},
        status: boardTest.status, //recupère le status du json
        boardGame: boardTest, //on balance le json de la partie
        createdAt: new Date(boardTest.startedAt),
        updatedAt: boardTest.finishedAt
      }
  })
  console.log('Game seeded:', { game1 });
}

game()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  })