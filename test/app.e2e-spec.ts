import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateAdminDto } from '@src/admins/dtos/create-admin.dto';
import { Admin } from '@src/admins/schemas/admin.schema';
import { AppModule } from '@src/app.module';
import { CreateUserDto } from '@src/users/dtos/create-user.dto';
import { User } from '@src/users/schemas/user.schema';
import { CreateSchoolDto } from '@src/schools/dtos/create-school.dto';
import { TestConfigModule } from './test.config.module';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

//TODO : 테스트DB를 따로 만들어서 테스트하도록 수정

describe('App Testing (e2e)', () => {
  let app: INestApplication;
  let createdAdmin: Admin;
  let createdUser: User;

  const testAdminUser: CreateAdminDto = {
    name: '김리자',
    email: 'kiddssssm@gmail.com',
  };

  const testUser: CreateUserDto = {
    name: '김생',
    email: 'kimddssmm.student@gmail.com',
  };

  let moduleFixture: TestingModule;
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          `mongodb+srv://${process.env.TEST_MONGO_USER}:${process.env.TEST_MONGO_PASSWORD}@${process.env.TEST_MONGO_HOST}`,
        ),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const userModel: Model<any> = moduleFixture.get(getModelToken('User'));
    await userModel.deleteMany({});
    const adminModel: Model<any> = moduleFixture.get(getModelToken('Admin'));
    await adminModel.deleteMany({});
    const schoolModel: Model<any> = moduleFixture.get(getModelToken('School'));
    await schoolModel.deleteMany({});

    await app.close();
  });

  ///////////////////

  describe('/admins (POST)', () => {
    it('creates admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/admins')
        .send(testAdminUser)
        .expect(HttpStatus.CREATED);

      createdAdmin = response.body.data;
      expect(createdAdmin).toHaveProperty('_id');
      expect(createdAdmin).toHaveProperty('name');
      expect(createdAdmin).toHaveProperty('email');
      expect(createdAdmin).toHaveProperty('createdAt');
      expect(createdAdmin).toHaveProperty('updatedAt');
      expect(createdAdmin.name).toBe(testAdminUser.name);

      console.log({ createdAdmin });
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

  describe('/users (POST)', () => {
    it('creates user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(HttpStatus.CREATED);

      createdUser = response.body.data;
      expect(createdUser).toHaveProperty('_id');
      expect(createdUser).toHaveProperty('name');
      expect(createdUser).toHaveProperty('email');
      expect(createdUser).toHaveProperty('createdAt');
      expect(createdUser).toHaveProperty('updatedAt');
      expect(createdUser.name).toBe(testUser.name);

      console.log({ createdUser });
    });

    it('throws error when email already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/users')
        .send(testUser)
        .expect(HttpStatus.BAD_REQUEST);

      const { message } = response.body;
      expect(message).toBe('이미 존재하는 email입니다.');
    });
  });

  describe('/schools (POST)', () => {
    it('creates school', async () => {
      const testSchool: CreateSchoolDto = {
        name: '테스트트초등오학교',
        address: '서울 강남구 테스트로 123',
        admin: createdAdmin._id,
      };

      const response = await request(app.getHttpServer())
        .post('/schools')
        .send(testSchool)
        .expect(HttpStatus.CREATED);

      const createdSchool = response.body.data;

      console.log({ createdSchool });
      expect(createdSchool).toHaveProperty('_id');
      expect(createdSchool).toHaveProperty('name');
      expect(createdSchool).toHaveProperty('address');
      expect(createdSchool).toHaveProperty('createdAt');
      expect(createdSchool).toHaveProperty('updatedAt');
      expect(createdSchool.name).toBe(testSchool.name);

      console.log({ createdSchool });
    });
  });
});
