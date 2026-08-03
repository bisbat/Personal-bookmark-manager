// ไฟล์: src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // แนะนำให้ใส่ @Global() ไว้ครับ โมดูลอื่นจะได้เรียกใช้ Prisma ได้เลยโดยไม่ต้อง import ซ้ำ
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // 👈 บรรทัดนี้สำคัญมาก! ถ้าไม่มี โมดูลอื่นจะดึงไปใช้ไม่ได้
})
export class PrismaModule {}