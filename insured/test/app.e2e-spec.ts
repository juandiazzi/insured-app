import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('SchedulingController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /scheduling should return 200', async () => {
    const res = await request(app.getHttpServer()).get('/scheduling');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /scheduling should validate insuredId length', async () => {
    const res = await request(app.getHttpServer())
      .post('/scheduling')
      .send({ insuredId: '123', scheduleId: 101, countryISO: 'PE' });
    expect(res.status).toBe(400);
    expect(res.body.message[0]).toContain('insuredId debe tener exactamente 5 caracteres');
  });

  it('POST /scheduling should create a scheduling', async () => {
    const res = await request(app.getHttpServer())
      .post('/scheduling')
      .send({ insuredId: '00001', scheduleId: 101, countryISO: 'PE' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('pk');
    expect(res.body.insuredId).toBe('00001');
  });

  it('GET /scheduling/:id should return a scheduling or not found message', async () => {
    const res = await request(app.getHttpServer()).get('/scheduling/101');
    expect([200, 404]).toContain(res.status);
  });
});