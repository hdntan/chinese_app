import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hsk1 = await prisma.hskLevel.upsert({
    where: { level: 1 },
    update: {},
    create: {
      level: 1,
      name: 'HSK 1',
      description: 'Beginner level',
    },
  });

  console.log({ hsk1 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
