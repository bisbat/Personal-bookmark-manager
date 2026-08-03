// test/bookmarks.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';

jest.mock('jwks-rsa', () => ({
  __esModule: true,
  passportJwtSecret: jest.fn(() => () => undefined),
}));

describe('Bookmarks (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  // ค่าจาก seed data ที่มีอยู่แล้ว — ใส่ ownerId จริงจาก seed.ts ตรงนี้
  const USER_A_SUB = 'auth0|user-a-1111';
  const USER_B_SUB = 'auth0|user-b-2222';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      // แทนที่ guard จริง — ให้ "ล็อกอินเป็นใคร" มาจาก header พิเศษที่ test กำหนดเอง
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const req = context.switchToHttp().getRequest();
          const sub = req.headers['x-test-user-sub'];
          if (!sub) {
            throw new UnauthorizedException(); // จำลองพฤติกรรมจริงของ guard เมื่อไม่มี token
          }
          req.user = { sub: req.headers['x-test-user-sub'] };
          return true; // ผ่าน guard เสมอในโหมด test — ไม่เกี่ยวกับ production
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('User A can list their own bookmarks (happy path)', async () => {
    const res = await request(app.getHttpServer())
      .get('/bookmark')
      .set('x-test-user-sub', USER_A_SUB);

    expect(res.status).toBe(200);
    // ทุก bookmark ที่ได้กลับมาต้องเป็นของ User A เท่านั้น
    res.body.forEach((bookmark: any) => {
      expect(bookmark.ownerId).toBe(USER_A_SUB);
    });
  });

  it('User A cannot access User B\'s bookmark by ID (cross-user denial)', async () => {
    // หา bookmark ที่เป็นของ User B จาก seed data จริง
    const userBBookmark = await prisma.bookmark.findFirst({
      where: { ownerId: USER_B_SUB },
    });
    if (!userBBookmark) {
      throw new Error('Expected a bookmark for User B from seed data');
    }

    const res = await request(app.getHttpServer())
      .get(`/bookmark/${userBBookmark.id}`)
      .set('x-test-user-sub', USER_A_SUB); // ล็อกอินเป็น User A แต่ขอ resource ของ User B

    expect(res.status).toBe(404); // หรือ 403 ตามที่ตกลงไว้ใน API_DESIGN.md
  });

  it('rejects requests with no authenticated user', async () => {
    const res = await request(app.getHttpServer())
      .get('/bookmark');

    expect(res.status).toBe(401);
  });
});