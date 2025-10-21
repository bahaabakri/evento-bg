import { Not, Repository } from "typeorm"
import { User } from "./user.entity"
import { Test } from "@nestjs/testing"
import { UserService } from "./user.service"
import { Role } from "./roles.enum"
import { NotFoundException } from "@nestjs/common"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Status } from "./user-status.enum"
let mockUser: User = {
    id: 1, email: 'test@gmail.com', role: Role.USER, isVerified: false, otps: [], joinedEvents: [], createdEvents:[], firstname: 'Test', lastname: 'User', phone: '111111', status: Status.APPROVED
}
describe('UserService', () => {
    let userService: UserService;
    let fakeUserRepo: Partial<Repository<User>>
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
        it('should create user in db with status approved', async () => {
            (fakeUserRepo.create as jest.Mock).mockReturnValue(mockUser); // role: USER
            (fakeUserRepo.save as jest.Mock).mockResolvedValue(mockUser); // role : USER
            const res = await userService.createUser({ email: mockUser.email });
            expect(fakeUserRepo.create).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.create).toHaveBeenCalledWith({
                email: mockUser.email,
                isVerified: false,
                role: mockUser.role,
                status: Status.APPROVED
            })
            expect(fakeUserRepo.save).toHaveBeenCalledWith(mockUser);
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
        })
    }),
    describe('createAdmin', () => {
        it('should create admin in db with status pending', async () => {
            const mockAdmin = { ...mockUser, role: Role.ADMIN };
            (fakeUserRepo.create as jest.Mock).mockReturnValue(mockAdmin); // role: ADMIN
            (fakeUserRepo.save as jest.Mock).mockResolvedValue(mockAdmin); // role : ADMIN
            const res = await userService.createAdmin({ email: mockAdmin.email, firstname: mockUser.firstname, lastname: mockUser.lastname, phone: mockUser.phone });
            expect(fakeUserRepo.create).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.create).toHaveBeenCalledWith({
                email: mockAdmin.email, 
                firstname: mockUser.firstname, 
                lastname: mockUser.lastname, 
                phone: mockUser.phone ,
                isVerified: false,
                role: Role.ADMIN,
                status: Status.PENDING
            })
            expect(fakeUserRepo.save).toHaveBeenCalledWith(mockAdmin);
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockAdmin.email);
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
        }),
        it('should save admin in db', async () => {
            const mockAdmin = { ...mockUser, role: Role.ADMIN };
            (fakeUserRepo.save as jest.Mock).mockResolvedValue(mockAdmin);
            const res = await userService.saveUser(mockAdmin);
            expect(fakeUserRepo.save).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.save).toHaveBeenCalledWith(mockAdmin);
            expect(res).toBeDefined();
            expect(res.email).toBe(mockAdmin.email);
        })
    
    })
    describe('findUserByEmail', () => {
        it('should find user by email in case findOneBy return user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(mockUser);
            const res = await userService.findUserByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({ email: mockUser.email, role: Role.USER });
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
            expect(res?.role).toBe(Role.USER);
        })
        it('should return null if findOneBy not found user by email', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            const res = await userService.findUserByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({ email: mockUser.email, role: Role.USER });
            expect(res).toBeNull();
        })
    })
    describe('findAdminByEmail', () => {
        it('should find admin by email in case findOneBy return admin', async () => {
            const mockAdmin = { ...mockUser, role: !Role.USER };
            (fakeUserRepo.findOne as jest.Mock).mockResolvedValue(mockAdmin);
            const res = await userService.findAdminByEmail(mockAdmin.email);
            expect(fakeUserRepo.findOne).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOne).toHaveBeenCalledWith(
                {
                    where: {
                        email: mockAdmin.email,
                        role: Not(Role.USER),
                    },
                }
            );
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockAdmin.email);
            expect(res?.role).toBe(!Role.USER);
        })
        it('should return null if findOne not found admin by email', async () => {
            const mockAdmin = { ...mockUser, role: !Role.USER };
            (fakeUserRepo.findOne as jest.Mock).mockResolvedValue(null);
            const res = await userService.findAdminByEmail(mockAdmin.email);
            expect(fakeUserRepo.findOne).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOne).toHaveBeenCalledWith(
                {
                    where: {
                        email: mockAdmin.email,
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
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({ email: mockUser.email });
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
        })
        it('should return null if findOneBy not found by email neither admin nor user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            const res = await userService.findUserAdminByEmail(mockUser.email);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({ email: mockUser.email });
            expect(res).toBeNull();
        })
    })
    //////////////////////////////
    describe('findUserById', () => {
        it('should find user by id in case findOneBy return user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(mockUser);
            const res = await userService.findUserById(mockUser.id);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({ id: mockUser.id, role: Role.USER });
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockUser.email);
        })
        it('should return null if findOneBy not found user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            const res = await userService.findUserById(mockUser.id);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({ id: mockUser.id, role: Role.USER });
            expect(res).toBeNull();
        })
    })
    describe('findAdminById', () => {
        it('should find admin by id in case findOne return admin', async () => {
            const mockAdmin = { ...mockUser, role: !Role.USER };
            (fakeUserRepo.findOne as jest.Mock).mockResolvedValue(mockAdmin);
            const res = await userService.findAdminById(mockAdmin.id);
            expect(fakeUserRepo.findOne).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOne).toHaveBeenCalledWith({
                    where: {
                        id: mockAdmin.id,
                        role: Not(Role.USER),
                    },
                }
            );
            expect(res).toBeDefined();
            expect(res?.email).toBe(mockAdmin.email);
        })
        it('should return null if findOne not found admin', async () => {
            const mockAdmin = { ...mockUser, role: !Role.USER };
            (fakeUserRepo.findOne as jest.Mock).mockResolvedValue(null);
            const res = await userService.findAdminById(mockAdmin.id);
            expect(fakeUserRepo.findOne).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOne).toHaveBeenCalledWith({
                     where: {
                        id: mockAdmin.id,
                        role: Not(Role.USER),
                    },
            });
            expect(res).toBeNull();
        })
    })
    describe('findAllUsers', () => {
        it('should find all users in case find return users', async () => {
            (fakeUserRepo.find as jest.Mock).mockResolvedValue([mockUser]);
            const res = await userService.findUsers({page: 1, perPage: 10, query: ''});
            expect(fakeUserRepo.find).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.find).toHaveBeenCalledWith();
            expect(res).toBeDefined();
            expect(res[0].email).toBe(mockUser.email);
        })
        it('should return empty array if find not found any user', async () => {
            (fakeUserRepo.find as jest.Mock).mockResolvedValue([]);
            const res = await userService.findUsers({page: 1, perPage: 10, query: ''});
            expect(fakeUserRepo.find).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.find).toHaveBeenCalledWith();
            expect(res).toBeDefined();
            expect(res.data.length).toBe(0);
        })
    })
    describe('removeUser', () => {
        it('should remove user in case findOneBy return user', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(mockUser);
            (fakeUserRepo.remove as jest.Mock).mockReturnValue(mockUser);
            const res = await userService.removeUser(mockUser.id);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOneBy).toHaveBeenCalledWith({ id: mockUser.id, role: Role.USER });
            expect(fakeUserRepo.remove).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.remove).toHaveBeenCalledWith(mockUser);
            expect(res).toBeDefined();
            expect(res.message).toBeDefined();
        })
        it('should throw NotFoundException if user not found', async () => {
            (fakeUserRepo.findOneBy as jest.Mock).mockResolvedValue(null);
            await expect(userService.removeUser(mockUser.id)).rejects.toThrow(NotFoundException);
        })
    })
    describe('approveAdmin', () => {
        it('should approve admin in case findOne return admin', async () => {
            const mockAdmin = { ...mockUser, role: Role.ADMIN, status: Status.PENDING };
            const approvedAdmin = { ...mockAdmin, status: Status.APPROVED };
            (fakeUserRepo.findOne as jest.Mock).mockResolvedValue(mockAdmin);
            (fakeUserRepo.save as jest.Mock).mockReturnValue(approvedAdmin);
            const res = await userService.approveAdmin(mockAdmin.id);
            expect(fakeUserRepo.findOne).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.findOne).toHaveBeenCalledWith({
                where: { id: mockAdmin.id, role: Not(Role.USER) }
            });
            expect(fakeUserRepo.save).toHaveBeenCalledTimes(1);
            expect(fakeUserRepo.save).toHaveBeenCalledWith(approvedAdmin);
            expect(res).toBeDefined();
            expect(res.user.status).toBe(Status.APPROVED);
        })
        it('should throw NotFoundException if admin not found', async () => {
            (fakeUserRepo.findOne as jest.Mock).mockResolvedValue(null);
            await expect(userService.approveAdmin(mockUser.id)).rejects.toThrow(NotFoundException);
        })
    })
})