import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
console.log('Connection String:', connectionString);
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // 1. Seed Admin User
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash('password', salt);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      fullName: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log({ admin });

  // 2. Seed HSK Levels
  const levels = [
    { level: 1, name: 'HSK 1', description: 'Beginner' },
    { level: 2, name: 'HSK 2', description: 'Elementary' },
    { level: 3, name: 'HSK 3', description: 'Intermediate' },
    { level: 4, name: 'HSK 4', description: 'Upper Intermediate' },
    { level: 5, name: 'HSK 5', description: 'Advanced' },
    { level: 6, name: 'HSK 6', description: 'Proficiency' },
  ];

  for (const l of levels) {
    await prisma.hskLevel.upsert({
      where: { level: l.level },
      update: {},
      create: l,
    });
  }
  console.log('Levels seeded');

  // 3. Seed Lesson for HSK 1
  const hsk1 = await prisma.hskLevel.findUnique({ where: { level: 1 } });
  if (hsk1) {
    // Check if lesson exists to avoid duplicates
    const existingLesson = await prisma.lesson.findFirst({
      where: { title: 'Lesson 1: Hello', levelId: hsk1.id },
    });

    if (!existingLesson) {
      const lesson1 = await prisma.lesson.create({
        data: {
          title: 'Lesson 1: Hello',
          levelId: hsk1.id,
          orderIndex: 1,
          vocabularies: {
            create: [
              { hanzi: '你好', pinyin: 'nǐ hǎo', meaningVn: 'Xin chào' },
              { hanzi: '我', pinyin: 'wǒ', meaningVn: 'Tôi' },
            ],
          },
          dialogues: {
            create: [
              {
                roleName: 'A',
                contentHanzi: '你好',
                contentPinyin: 'Nǐ hǎo',
                meaningVn: 'Xin chào',
                orderIndex: 1,
              },
              {
                roleName: 'B',
                contentHanzi: '你好',
                contentPinyin: 'Nǐ hǎo',
                meaningVn: 'Xin chào',
                orderIndex: 2,
              },
            ],
          },
        },
      });
      console.log({ lesson1 });
    } else {
      console.log('Lesson 1 already exists');
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
