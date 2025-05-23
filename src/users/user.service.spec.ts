import { Not, Repository } from "typeorm"
import { User } from "./user.entity"
import { Test } from "@nestjs/testing"
import { UserService } from "./user.service"
import { Role } from "./roles.enum"
import { NotFoundException } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm"
let mockUser:User = {
    id: 1, email: 'test@gmail.com', role: Role.USER, isVerified: false, otps:[]
}
describe('UserService', () => {
    let userService: UserService;
    let fakeUserRepo:Partial<Repository<User>>
    beforeEach(async () => {
        fakeUserRepo = {
            findOneBy: jest.fn().mockResolvedValue(null),
            findOne: jest.fn().mockResolvedValue(null),
            find: jest.fn().mockResolvedValue(null),
            create: jest.fn().mockResolvedValue(null),
            save: jest.fn().mockResolvedValue(null),
            remove: jest.fn().mockResolvedValue(null),
        }

        const module = await Test.createTestingModule({
            providers: [
                UserService,
                { provide: getRepositoryToken(User), useValue: fakeUserRepo }
            ]
        }).compile();
        userService = module.get<UserService>(UserService);
    })
    describe('createUser', () => {
        it('should create user in db', async () => {
            (fakeUserRepo.create as jest.Mock).mockReturnValue(mockUser);
            (fakeUserRepo.save as jest.Mock).mockResolvedValue(mockUser);
            const res = await userService.createUser({email: mockUser.email});
            expect(fakeUserRepo.create).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.create).toHaveBeenCalledWith({
                ...{email: mockUser.email},
                isVerified: false,
                role: mockUser.role
            })
            expect(fakeUserRepo.save).toHaveBeenCalledWith(mockUser);
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
        })
    })
    describe('saveUser', () => {
        it('should save user in db', async () => {
            (fakeUserRepo.save as jest.Mock).mockResolvedValue(mockUser);
            const res = await userService.saveUser(mockUser);
            expect(fakeUserRepo.save).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.save).toHaveBeenCalledWith(mockUser);
            expect(res).toBeDefined();
            expect(res.email).toBe(mockUser.email);
        })
    })
    describe('findUserByEmail', () => {
        it('should find user by email in case findOneBy return user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(mockUser);
            const res = await userService.findUserByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({email: mockUser.email, role: Role.USER});
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
            expect(res?.role).toBe(Role.USER);
        })
        it('should return null if findOneBy not found user by email', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            const res = await userService.findUserByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({email: mockUser.email, role: Role.USER});
            expect(res).toBeNull();
        })
    })
    describe('findAdminByEmail', () => {
        it('should find admin by email in case findOneBy return admin', async () => {
            (fakeUserRepo.findOne as jest.Mock).mockResolvedValue(
                {
                    ...mockUser,
                    role: Role.ADMIN
                }
            );
            const res = await userService.findAdminByEmail(mockUser.email);
            expect(fakeUserRepo.findOne).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOne).toHaveBeenCalledWith(
                {
                    where: {
                    email:mockUser.email,
                    role: Not(Role.USER),
                    },
                }
            );
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
            expect(res?.role).toBe(Role.ADMIN);
        })
        it('should return null if findOne not found admin by email', async () => {
            (fakeUserRepo.findOne as jest.Mock).mockResolvedValue(null);
            const res = await userService.findAdminByEmail(mockUser.email);
            expect(fakeUserRepo.findOne).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOne).toHaveBeenCalledWith(
                {
                    where: {
                    email:mockUser.email,
                    role: Not(Role.USER),
                    },
                }
            )
            expect(res).toBeNull();
        })
    })
    describe('findUserAdminByEmail', () => {
        it('should find user or admin by email in case findOneBy return user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(mockUser);
            const res = await userService.findUserAdminByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({email: mockUser.email});
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
        })
        it('should return null if findOneBy not found by email neither admin nor user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            const res = await userService.findUserAdminByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({email: mockUser.email});
            expect(res).toBeNull();
        })
    })

    describe('findUserById', () => {
        it('should find user by id in case findOneBy return user or admin', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(mockUser);
            const res = await userService.findUserAdminByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({email: mockUser.email});
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
        })
        it('should return null if findOneBy not found by id neither user nor admin', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            const res = await userService.findUserAdminByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({email: mockUser.email});
            expect(res).toBeNull();
        })
    })
    describe('findAllUsers', () => {
        it('should find all users in case find return users', async () => {
            (fakeUserRepo.find as jest.Mock).mockResolvedValue([mockUser]);
            const res = await userService.findAllUsers();
            expect(fakeUserRepo.find).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.find).toHaveBeenCalledWith();
            expect(res).toBeDefined();
            expect(res[0].email).toBe(mockUser.email);
        })
        it('should return empty array if find not found any user', async () => {
            (fakeUserRepo.find as jest.Mock).mockResolvedValue([]);
            const res = await userService.findAllUsers();
            expect(fakeUserRepo.find).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.find).toHaveBeenCalledWith();
            expect(res).toBeDefined();
            expect(res.length).toBe(0);
        })
    })
    describe('removeUser', () => {
        it('should remove user in case findOneBy return user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(mockUser);
            (fakeUserRepo.remove as jest.Mock).mockReturnValue(mockUser);
            const res = await userService.removeUser(mockUser.id);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({id: mockUser.id});
            expect(fakeUserRepo.remove).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.remove).toHaveBeenCalledWith(mockUser);
            expect(res).toBeDefined();
        })
        it('should throw NotFoundException if user not found', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            await expect(userService.removeUser(mockUser.id)).rejects.toThrow(NotFoundException);
        })
    })
})