import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateAdminDto } from '@src/admins/dtos/create-admin.dto';
import { Admin } from '@src/admins/schemas/admin.schema';
import { AppModule } from '@src/app.module';

describe('AdminsController (e2e)', () => {
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

  describe('/admins (POST)', () => {
    const testAdminUser: CreateAdminDto = {
      name: '김선생',
      email: 'kim@gmail.com',
    };
    it('creates admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/admins')
        .send(testAdminUser)
        .expect(HttpStatus.CREATED);

      const createdAdmin: Admin = response.body.data;
      expect(createdAdmin).toHaveProperty('_id');
      expect(createdAdmin).toHaveProperty('name');
      expect(createdAdmin).toHaveProperty('createdAt');
      expect(createdAdmin).toHaveProperty('updatedAt');
      expect(createdAdmin.name).toBe(testAdminUser.name);
    });

    it('throws error when email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/admins')
        .send(testAdminUser)
        .expect(HttpStatus.BAD_REQUEST);

      const { message } = response.body;
      expect(message).toBe('이미 존재하는 email입니다.');
    });
  });

  describe('/admins (GET)', () => {
    it('return admins', async () => {
      const response = await request(app.getHttpServer())
        .get('/admins')
        .expect(HttpStatus.OK);

      const admins: Admin[] = response.body.data;

      expect(Array.isArray(admins)).toBeTruthy();
    });
  });
});
