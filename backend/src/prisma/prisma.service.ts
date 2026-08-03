import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../prisma/generated/client'; 

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    // ดึง URL ของ Database จาก Environment Variables
    const connectionString = `${process.env.DATABASE_URL}`;
    
    // สร้าง Connection Pool และ Adapter ของ PostgreSQL
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    // ส่ง adapter เข้าไปให้ PrismaClient ทำงาน
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}