import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { OtpService } from '../otp/otp.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { Role } from '../users/roles.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
import { Test } from '@nestjs/testing';
import { Otp } from 'src/otp/otp.entity';
import { mock } from 'node:test';

let mockUser:User = {
    id: 1, email: 'test@gmail.com', role: Role.USER, isVerified: false, otps:[]
}
let mockOtp:Otp = {
    id: 1, code: '123456', createdAt: new Date(), expiredAt: new Date(Date.now() + 5 * 60 * 1000), user: mockUser
}
describe('AuthService', () => {
    let authService: AuthService;
    let fakeUserService: Partial<UserService>;
    let fakeOtpService: Partial<OtpService>; 
    beforeEach(async () => {
        fakeUserService = {
            findAdminByEmail: jest.fn().mockResolvedValue(null),
            createUser: jest.fn().mockResolvedValue(mockUser),
            findUserByEmail: jest.fn().mockResolvedValue(null),
            findUserAdminByEmail: jest.fn().mockResolvedValue(null),
            saveUser: jest.fn().mockResolvedValue(mockUser),
        }

        fakeOtpService = {
            sendOtp: jest.fn().mockResolvedValue(undefined),
            getLastUserOtp: jest.fn().mockResolvedValue(null)
        }
        // create test module
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UserService, useValue: fakeUserService },
                { provide: OtpService, useValue: fakeOtpService },
            ],
        }).compile();
        authService = module.get<AuthService>(AuthService);
    });

    describe('createLoginAdmin', () => {
        it('should create admin if not exists and send otp', async () => {
            const res = await authService.createLoginAdmin({email: mockUser.email});
            expect(fakeUserService.findAdminByEmail).toHaveBeenCalledTimes(1);
            expect(fakeUserService.createUser).toHaveBeenCalledTimes(1);
            expect(fakeOtpService.sendOtp).toHaveBeenCalledTimes(1);
            expect(res.admin).toBeDefined();
            expect(res.admin.email).toBe(mockUser.email);
        });

        it('should login admin if exists and send otp', async () => {
            (fakeUserService.findAdminByEmail as jest.Mock).mockResolvedValue(mockUser);
            const res = await authService.createLoginAdmin({email: mockUser.email});
            expect(fakeUserService.findAdminByEmail).toHaveBeenCalledTimes(1);
            expect(fakeUserService.createUser).toHaveBeenCalledTimes(0);
            expect(res.admin).toBeDefined();
            expect(res.admin.email).toBe(mockUser.email);
        });
        it('should throw BadRequestException if sendOtp fails', async () => {
            (fakeOtpService.sendOtp as jest.Mock).mockRejectedValue(new Error('Unable to send otp'));
            await expect(authService.createLoginAdmin({email: mockUser.email})).rejects.toThrow(BadRequestException);
            expect(fakeOtpService.sendOtp).toHaveBeenCalledTimes(1);
        })
    });

    describe('createLoginUser', () => {
        it('should create user if not exists and send otp', async () => {
            const res = await authService.createLoginUser({email: mockUser.email});
            expect(fakeUserService.findUserByEmail).toHaveBeenCalledTimes(1);
            expect(fakeUserService.createUser).toHaveBeenCalledTimes(1);
            expect(fakeOtpService.sendOtp).toHaveBeenCalledTimes(1);
            expect(res.user).toBeDefined();
            expect(res.user.email).toBe(mockUser.email);
        });

        it('should login admin if exists and send otp', async () => {
            (fakeUserService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
            const res = await authService.createLoginUser({email: mockUser.email});
            expect(fakeUserService.findUserByEmail).toHaveBeenCalledTimes(1);
            expect(fakeUserService.createUser).toHaveBeenCalledTimes(0);
            expect(res.user).toBeDefined();
            expect(res.user.email).toBe(mockUser.email);
        });
        it('should throw BadRequestException if sendOtp fails', async () => {
            (fakeOtpService.sendOtp as jest.Mock).mockRejectedValue(new Error('Unable to send otp'));
            await expect(authService.createLoginUser({email: mockUser.email})).rejects.toThrow(BadRequestException);
            expect(fakeOtpService.sendOtp).toHaveBeenCalledTimes(1);
        })
    });

    describe('verifyUserAdmin', () => {
        it('should throw NotFoundException if user not found', async () => {
            // (fakeUserService.findUserAdminByEmail as jest.Mock).mockResolvedValue(null);
            await expect(authService.verifyUserAdmin(mockUser.email, mockOtp.code)).rejects.toThrow(NotFoundException);
        });

        it('should throw NotFoundException if no otp sent', async () => {
            (fakeUserService.findUserAdminByEmail as jest.Mock).mockResolvedValue(mockUser);
            (fakeOtpService.getLastUserOtp as jest.Mock).mockResolvedValue(null);
            await expect(authService.verifyUserAdmin(mockUser.email, mockOtp.code)).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if otp is wrong', async () => {
            (fakeUserService.findUserAdminByEmail as jest.Mock).mockResolvedValue(mockUser);
            (fakeOtpService.getLastUserOtp as jest.Mock).mockResolvedValue(mockOtp);
            await expect(authService.verifyUserAdmin(mockUser.email, '654321')).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if otp is expired', async () => {
            (fakeUserService.findUserAdminByEmail as jest.Mock).mockResolvedValue(mockUser);
            (fakeOtpService.getLastUserOtp as jest.Mock).mockResolvedValue({
                ...mockOtp,
                expiredAt: new Date(Date.now() - 10 * 60 * 1000), // mocking expiredAt
            });
            await expect(authService.verifyUserAdmin(mockUser.email, mockOtp.code)).rejects.toThrow(BadRequestException);
        });
        it('should verify user with correct otp', async () => {
            (fakeUserService.findUserAdminByEmail as jest.Mock).mockResolvedValue(mockUser);
            (fakeOtpService.getLastUserOtp as jest.Mock).mockResolvedValue(mockOtp);
            const res = await authService.verifyUserAdmin(mockUser.email, mockOtp.code);
            expect(fakeUserService.saveUser).toHaveBeenCalledWith(expect.objectContaining({ isVerified: true }));
            expect(res.user).toBeDefined();
        });
    });
});