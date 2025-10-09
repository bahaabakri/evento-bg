import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { OtpService } from '../otp/otp.service';
import { CreateLoginDto } from './dto/request/create-login.dto';
import { Role } from '../users/roles.enum';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Otp } from '../otp/otp.entity';
import { Status } from '../users/status.enum';
let mockUser: User = {
    id: 1, email: 'test@gmail.com', role: Role.USER, isVerified: false, otps: [], createdEvents: [],joinedEvents:[], firstname: 'Test', lastname: 'User', phone: '111111', status: Status.APPROVED
}
let mockOtp: Otp = {
    id: 1, code: '123456', createdAt: new Date(), expiredAt: new Date(Date.now() + 5 * 60 * 1000), user: mockUser, context: 'auth'
}
describe('AuthService', () => {
    let authService: AuthService;
    let fakeUserService: Partial<UserService>;
    let fakeOtpService: Partial<OtpService>;
    let fakeHttpService: Partial<HttpService>;
    let fakeJwtService: Partial<JwtService>;
    beforeEach(async () => {
        fakeUserService = {
            findAdminByEmail: jest.fn().mockResolvedValue(null),
            createUser: jest.fn().mockResolvedValue(mockUser),
            createAdmin: jest.fn().mockResolvedValue(mockUser),
            findUserByEmail: jest.fn().mockResolvedValue(null),
            findUserAdminByEmail: jest.fn().mockResolvedValue(null),
            saveUser: jest.fn().mockResolvedValue(mockUser),
        },
        fakeHttpService = {
            get: jest.fn(),
        },
        fakeOtpService = {
            sendOtp: jest.fn().mockResolvedValue(undefined),
            getLastUserOtp: jest.fn().mockResolvedValue(null),
            verifyOtp: jest.fn().mockResolvedValue(true),
        },
        fakeJwtService = {
            sign: jest.fn().mockReturnValue('signed-token'),
        }
        // create test module
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                JwtService,
                ConfigService,
                HttpService,
                { provide: UserService, useValue: fakeUserService },
                {provide: HttpService, useValue: fakeHttpService},
                { provide: OtpService, useValue: fakeOtpService },
                { provide: JwtService, useValue: fakeJwtService },
            ],
        }).compile();
        authService = module.get<AuthService>(AuthService);
    });
    describe('registerLoginUser', () => {
        it('should create user if not exists and send otp', async () => {
            const res = await authService.registerLoginUser({ email: mockUser.email });
            // expect(fakeUserService.findAdminByEmail).toHaveBeenCalledTimes(1);
            expect(fakeUserService.createUser).toHaveBeenCalledTimes(1);
            expect(fakeOtpService.sendOtp).toHaveBeenCalledTimes(1);
            expect(res.user).toBeDefined();
            expect(res.user.email).toBe(mockUser.email);
        });

        it('should login user if exists and send otp', async () => {
            (fakeUserService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            const res = await authService.registerLoginUser({ email: mockUser.email });
            // expect(fakeUserService.findAdminByEmail).toHaveBeenCalledTimes(1);
            expect(fakeUserService.createUser).toHaveBeenCalledTimes(0);
            expect(fakeOtpService.sendOtp).toHaveBeenCalledTimes(1);
            expect(res.user).toBeDefined();
            expect(res.user.email).toBe(mockUser.email);
        });
    });

    describe('registerAdmin', () => {
        it('should throw BadRequestException if admin already exists', async () => {
            (fakeUserService.findAdminByEmail as jest.Mock).mockResolvedValue(mockUser);
            await expect(authService.registerAdmin({ ...mockUser})).rejects.toThrow(BadRequestException);
        });
        it('should create admin if not exists and send otp', async () => {
            const res = await authService.registerAdmin({ ...mockUser});
            expect(fakeUserService.createAdmin).toHaveBeenCalledTimes(1);
            expect(fakeOtpService.sendOtp).toHaveBeenCalledTimes(1);
            expect(res.user).toBeDefined();
            expect(res.user.email).toBe(mockUser.email);
        })
    })
    describe('loginAdmin', () => {
        it('should throw NotFoundException if admin not found', async () => {
            await expect(authService.loginAdmin({ email: mockUser.email })).rejects.toThrow(NotFoundException);
        });
        it('should throw ForbiddenException if admin not approved', async () => {
            (fakeUserService.findAdminByEmail as jest.Mock).mockResolvedValue({...mockUser, status: Status.PENDING});
            await expect(authService.loginAdmin({ email: mockUser.email })).rejects.toThrow(ForbiddenException);
        });
        it('should login admin if exists and approved and send otp', async () => {
            (fakeUserService.findAdminByEmail as jest.Mock).mockResolvedValue({ ...mockUser });
            const res = await authService.loginAdmin({ email: mockUser.email });
            expect(fakeOtpService.sendOtp).toHaveBeenCalledTimes(1);
            expect(res.user).toBeDefined();
            expect(res.user.email).toBe(mockUser.email);
        });
    })
    describe('verifyUser', () => {
        it('should throw NotFoundException if user not found', async () => {
            await expect(authService.verifyUser(mockUser.email, mockOtp.code)).rejects.toThrow(NotFoundException);
        });
        it('should verify otp and return access token if user found', async () => {
            (fakeUserService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            const res = await authService.verifyUser(mockUser.email, mockOtp.code);
            expect(fakeOtpService.verifyOtp).toHaveBeenCalledTimes(1);
            expect(res.user).toBeDefined();
            expect(res.user.email).toBe(mockUser.email);
            expect(res.access_token).toBeDefined();
        });
    });
    describe('verifyAdmin', () => {
        it('should throw NotFoundException if admin not found', async () => {
            await expect(authService.verifyAdmin(mockUser.email, mockOtp.code)).rejects.toThrow(NotFoundException);
        });
        it('should verify otp and return access token if admin found', async () => {
            (fakeUserService.findAdminByEmail as jest.Mock).mockResolvedValue(mockUser);
            const res = await authService.verifyAdmin(mockUser.email, mockOtp.code);
            expect(fakeOtpService.verifyOtp).toHaveBeenCalledTimes(1);
            expect(res.user).toBeDefined();
            expect(res.user.email).toBe(mockUser.email);
            expect(res.access_token).toBeDefined();
        });
    });
});