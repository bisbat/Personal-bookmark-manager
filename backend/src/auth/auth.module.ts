// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  // ลงทะเบียน Passport และบอกว่าให้ใช้ jwt เป็นค่าเริ่มต้น
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy], // นำเข้าด่านตรวจ
  exports: [PassportModule], // export ออกไปเผื่อ Module อื่นต้องการใช้
})
export class AuthModule {}