import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication sytem', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('auth/signup', () => {
    const email = 'unique1@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: '123456'})
      .expect(201)
      .then((res) => {
        const {id, email} = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email)
      })
  });

  it('auth/signup then whoami', async () => {
    const email = 'unique1@gmail.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: email, password: '123456'})
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const {body} = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)

    expect(body.email).toEqual(email);

  });
});
