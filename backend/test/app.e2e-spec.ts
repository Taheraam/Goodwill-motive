import { Test } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import * as crypto from 'crypto';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

/**
 * Boots the real AppModule (guards, pipes, routing) with Prisma mocked out,
 * so security behaviour is tested end-to-end without a database.
 */
describe('API security smoke tests (e2e)', () => {
  let app: any; let jwt: JwtService;
  const users: any = { u1: { id: 'u1', role: 'user', email: 'a@b.c', username: 'a' }, adm: { id: 'adm', role: 'admin', email: 'x@y.z', username: 'x' } };
  const prismaMock: any = {
    user: { findUnique: jest.fn(async ({ where }: any) => users[where.id] ?? null) },
    report: { findMany: jest.fn(async () => []) },
    payment: { updateMany: jest.fn(async () => ({ count: 0 })), findUnique: jest.fn(async () => ({ status: 'success' })) },
    $connect: jest.fn(), $disconnect: jest.fn(), onModuleInit: jest.fn(), onModuleDestroy: jest.fn(),
  };
  beforeAll(async () => {
    process.env.JWT_SECRET = 'y'.repeat(40); process.env.RAZORPAY_WEBHOOK_SECRET = 'whs'; process.env.ALLOW_OAUTH_SANDBOX='true';
    const mod = await Test.createTestingModule({ imports: [AppModule] }).overrideProvider(PrismaService).useValue(prismaMock).compile();
    app = mod.createNestApplication({ rawBody: true });
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.setGlobalPrefix('api'); await app.init(); jwt = app.get(JwtService);
  });
  afterAll(() => app.close());
  const tok = (sub: string, typ = 'access') => jwt.sign({ sub, typ });

  it('GET /auth/me returns the current user', async () => {
    const r = await request(app.getHttpServer()).get('/api/auth/me').set('Authorization', `Bearer ${tok('u1')}`);
    expect(r.status).toBe(200); expect(r.body.id).toBe('u1');
  });
  it('GET /auth/google sets an httpOnly state cookie and redirects', async () => {
    const r = await request(app.getHttpServer()).get('/api/auth/google');
    expect(r.status).toBe(302); expect(String(r.headers['set-cookie'])).toContain('gm_oauth_state');
    expect(r.headers.location).toMatch(/state=[0-9a-f]{48}/);
  });
  it('OAuth callback with a state that does not match the cookie is rejected', async () => {
    const r = await request(app.getHttpServer()).get('/api/auth/google/callback?code=sandbox_google_user&state=abc');
    expect(r.status).toBe(302); expect(r.headers.location).toContain('error=google_oauth_failed');
  });
  it('moderation reports are admin-only', async () => {
    const a = await request(app.getHttpServer()).get('/api/moderation/reports').set('Authorization', `Bearer ${tok('u1')}`);
    const b = await request(app.getHttpServer()).get('/api/moderation/reports').set('Authorization', `Bearer ${tok('adm')}`);
    expect(a.status).toBe(403); expect(b.status).toBe(200);
  });
  it('a refresh token cannot be used as an access token', async () => {
    const r = await request(app.getHttpServer()).get('/api/auth/me').set('Authorization', `Bearer ${tok('u1','refresh')}`);
    expect(r.status).toBe(401);
  });
  it('POST /auth/refresh issues a new token pair', async () => {
    const r = await request(app.getHttpServer()).post('/api/auth/refresh').send({ token: tok('u1','refresh') });
    expect(r.status).toBe(200); expect(r.body.tokens.accessToken).toBeTruthy();
  });
  it('Razorpay webhook verifies the HMAC over the raw body', async () => {
    const body = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'p', order_id: 'o' } } } });
    const sig = crypto.createHmac('sha256', 'whs').update(body).digest('hex');
    const bad = await request(app.getHttpServer()).post('/api/payments/webhook').set('Content-Type','application/json').set('x-razorpay-signature','zz').send(body);
    const ok = await request(app.getHttpServer()).post('/api/payments/webhook').set('Content-Type','application/json').set('x-razorpay-signature',sig).send(body);
    expect(bad.status).toBe(401); expect(ok.status).toBe(200);
  });
  it('login is rate limited', async () => {
    let last = 0;
    for (let i = 0; i < 12; i++) { last = (await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'q@q.q', password: 'x' })).status; }
    expect(last).toBe(429);
  });
});
