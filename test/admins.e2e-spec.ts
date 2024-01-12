import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateAdminDto } from '../src/admins/dtos/create-admin.dto';
import { Admin } from '../src/admins/schemas/admin.schema';
import { AppModule } from '../src/app.module';

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

  it('/admins (POST)', async () => {
    const createAdminDto: CreateAdminDto = {
      name: '김선생',
    };

    const response = await request(app.getHttpServer())
      .post('/admins')
      .send(createAdminDto)
      .expect(HttpStatus.CREATED);

    const createdAdmin: Admin = response.body.data;
    expect(createdAdmin).toHaveProperty('id');
    expect(createdAdmin.name).toBe(createAdminDto.name);

    // Optionally, you can store the createdAdmin for later use in other tests
  });

  it('/admins (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/admins')
      .expect(HttpStatus.OK);

    const admins: Admin[] = response.body.data;

    expect(Array.isArray(admins)).toBeTruthy();
  });
});
