import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Start seeding database...');

  // จำลอง Auth0 User IDs สำหรับทดสอบ Tenant Isolation
  const userA = "auth0|user-a-1111";
  const userB = "auth0|user-b-2222";

  // ล้างข้อมูลเก่าก่อนเพื่อไม่ให้เกิดข้อมูลซ้ำซ้อนเวลารันซ้ำ
  await prisma.bookmark.deleteMany();
  await prisma.collection.deleteMany();

  // สร้างข้อมูล Collection และ Bookmark สำหรับ User A
  const collectionA = await prisma.collection.create({
    data: {
      name: "Web Dev Stack",
      ownerId: userA,
      bookmarks: {
        create: [
          {
            title: "NestJS Documentation",
            url: "https://docs.nestjs.com/recipes/prisma",
            ownerId: userA,
          },
          {
            title: "Next.js Routing",
            url: "https://nextjs.org/docs/14/app/building-your-application/routing",
            ownerId: userA,
          },
        ],
      },
    },
  });

  // สร้างข้อมูล Collection และ Bookmark สำหรับ User B
  const collectionB = await prisma.collection.create({
    data: {
      name: "Finance & Investment",
      ownerId: userB,
      bookmarks: {
        create: [
          {
            title: "DCA Strategy Guide",
            url: "https://www.bitkub.com/en/blog/dca-dollar-cost-averaging-95dbc8ac4311",
            ownerId: userB,
          },
          {
            title: "S&P 500 Index Funds",
            url: "https://th.investing.com/indices/us-spx-500",
            ownerId: userB,
          },
        ],
      },
    },
  });

  console.log('✅ Seeding finished successfully.');
  console.log({ collectionA, collectionB });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });