import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/user.entity';
import { Role } from 'src/users/roles.enum';
import { OtpService } from 'src/otp/otp.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Otp } from 'src/otp/otp.entity';
import { Repository } from 'typeorm';

let mockUser:User = {
    id: 1, email: 'test22@gmail.com', role: Role.USER, isVerified: false, otps:[]
}
describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let otpService: OtpService;
  let otpRepo: Repository<Otp>;
  let userRepo: Repository<User>;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication()
    await app.init();
    otpService = moduleFixture.get<OtpService>(OtpService);
    otpRepo = moduleFixture.get<Repository<Otp>>(getRepositoryToken(Otp));
    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });

  it('handle user create or login', async() => {

    // Step 1: mock sendOtp before it's triggered
    jest.spyOn(otpService, 'sendOtp').mockImplementation(async (user) => {
      await otpRepo.save({
        code: '123456',
        user,
        expiredAt: new Date(Date.now() + 5 * 60 * 1000),
      } as any); // cast to any if needed
    });

    // Step 2: login register request
    const {status: loginRegisterStatus, body:loginRegisterBody} = await request(app.getHttpServer())
      .post('/auth/loginRegister')
      .send({email: mockUser.email})
    expect([200, 201]).toContain(loginRegisterStatus); // Check either status
    const { user:loginRegisterUser } = loginRegisterBody;
    expect(loginRegisterUser).toBeDefined();
    expect(loginRegisterUser.email).toEqual(mockUser.email);


    // Step 3: verify user with otp
    const {status: verifyStatus, body: verifyBody} = await request(app.getHttpServer())
      .post('/auth/verify')
      .send({email: mockUser.email, otp: '123456'})
    expect([200, 201]).toContain(verifyStatus); // Check either status
    const { user:verifyUser } = verifyBody;
    expect(verifyUser).toBeDefined();
    expect(verifyUser.email).toEqual(mockUser.email);
    expect(verifyUser.isVerified).toBeTruthy();
  });
});