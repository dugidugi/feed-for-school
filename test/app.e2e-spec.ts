import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateAdminDto } from '@src/admins/dtos/create-admin.dto';
import { Admin } from '@src/admins/schemas/admin.schema';
import { User } from '@src/users/schemas/user.schema';
import { AppModule } from '@src/app.module';
import { CreateUserDto } from '@src/users/dtos/create-user.dto';
import { CreateSchoolDto } from '@src/schools/dtos/create-school.dto';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { School } from '@src/schools/schemas/school.schema';
import { News } from '@src/news/schemas/news.schema';

describe('App Testing (e2e)', () => {
  let app: INestApplication;
  let createdAdmin: Admin;
  let createdUser: User;
  let createdSchool: School;
  let createdNews: News;

  const testAdminUser: CreateAdminDto = {
    name: '김선생',
    email: 'kim.teacher@gmail.com',
  };

  const testUser: CreateUserDto = {
    name: '김학생',
    email: 'kim.student@gmail.com',
  };

  let moduleFixture: TestingModule;
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`,
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
    const newsModel: Model<any> = moduleFixture.get(getModelToken('News'));
    await newsModel.deleteMany({});
    const userFollowModel: Model<any> = moduleFixture.get(
      getModelToken('UserFollow'),
    );
    await userFollowModel.deleteMany({});

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
        name: '테스트초등학교',
        address: '서울 강남구 테스트로 123',
        admin: createdAdmin._id,
      };

      const response = await request(app.getHttpServer())
        .post('/schools')
        .send(testSchool)
        .expect(HttpStatus.CREATED);

      createdSchool = response.body.data;

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

  describe('/users/:userId/following/:schoolId (POST)', () => {
    it('follows school', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${createdUser._id}/following/${createdSchool._id}`)
        .expect(HttpStatus.CREATED);

      const userFollow = response.body.data;
      expect(userFollow).toHaveProperty('_id');
      expect(userFollow).toHaveProperty('user');
      expect(userFollow).toHaveProperty('school');
      expect(userFollow).toHaveProperty('createdAt');
      expect(userFollow).toHaveProperty('updatedAt');
      expect(userFollow.user).toBe(createdUser._id);
      expect(userFollow.school).toBe(createdSchool._id);

      console.log({ userFollow });
    });

    it('throws error when already following school', async () => {
      const response = await request(app.getHttpServer())
        .post(`/users/${createdUser._id}/following/${createdSchool._id}`)
        .expect(HttpStatus.BAD_REQUEST);

      const { message } = response.body;
      expect(message).toBe('already following');
    });
  });

  describe('/users/:userId/following (GET)', () => {
    it('gets following schools', async () => {
      const response = await request(app.getHttpServer())
        .get(
          `/users/${createdUser._id}/following?pageSize=10&page=1&sort=createdAt.desc`,
        )
        .expect(HttpStatus.OK);

      const userFollows = response.body.data;
      expect(userFollows).toHaveLength(1);
      expect(userFollows[0]).toHaveProperty('_id');
      expect(userFollows[0]).toHaveProperty('user');
      expect(userFollows[0]).toHaveProperty('school');
      expect(userFollows[0]).toHaveProperty('createdAt');
      expect(userFollows[0]).toHaveProperty('updatedAt');
      expect(userFollows[0].user).toBe(createdUser._id);
      expect(userFollows[0].school).toBe(createdSchool._id);

      console.log({ userFollows });
    });
  });

  describe('/news (POST)', () => {
    it('creates news', async () => {
      const testNews = {
        title: '테스트 뉴스',
        content: '테스트 뉴스 내용',
        school: createdSchool._id,
        admin: createdAdmin._id,
      };
      const response = await request(app.getHttpServer())
        .post('/news')
        .send(testNews)
        .expect(HttpStatus.CREATED);

      createdNews = response.body.data;
      expect(createdNews).toHaveProperty('_id');
      expect(createdNews).toHaveProperty('title');
      expect(createdNews).toHaveProperty('content');
      expect(createdNews).toHaveProperty('school');
      expect(createdNews).toHaveProperty('admin');
      expect(createdNews).toHaveProperty('createdAt');
      expect(createdNews).toHaveProperty('updatedAt');
      expect(createdNews.title).toBe(testNews.title);
      expect(createdNews.content).toBe(testNews.content);
      expect(createdNews.school).toBe(testNews.school);
      expect(createdNews.admin).toBe(testNews.admin);

      console.log({ createdNews });
    });
  });

  describe('/news/:newsId (PUT)', () => {
    it('updates news', async () => {
      const newsUpdate = {
        title: '테스트 뉴스 수정',
        content: '테스트 뉴스 내용 수정',
      };
      const response = await request(app.getHttpServer())
        .put(`/news/${createdNews._id}`)
        .send(newsUpdate)
        .expect(HttpStatus.OK);

      const updatedNews = response.body.data;

      expect(updatedNews).toHaveProperty('_id');
      expect(updatedNews).toHaveProperty('title');
      expect(updatedNews).toHaveProperty('content');
      expect(updatedNews).toHaveProperty('school');
      expect(updatedNews).toHaveProperty('admin');
      expect(updatedNews).toHaveProperty('createdAt');
      expect(updatedNews).toHaveProperty('updatedAt');

      expect(updatedNews.title).toBe(newsUpdate.title);
      expect(updatedNews.content).toBe(newsUpdate.content);
    });
  });

  describe('/users/:userId/following/:schoolId (DELETE)', () => {
    it('unfollows school', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${createdUser._id}/following/${createdSchool._id}`)
        .expect(HttpStatus.OK);
    });
  });
});
