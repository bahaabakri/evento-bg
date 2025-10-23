import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { In, Not, Repository } from 'typeorm';
import { CreateLoginDto } from '../auth/dto/request/create-login.dto';
import { CreateAdminDto } from '@/modules/auth/dto/request/create-admin.dto';
import SearchUserDto from './dto/request/search-user.dto';
import { PaginatedResult } from '@/types/types';
import { UserType } from './user-type.enum';
import { UserStatus } from './user-status.enum';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private _userRepo: Repository<User>,
  ) {}

  /////////////////////// Private Helper Functions ///////////////////////
  private async _createWithRole<T extends Partial<User>>(
    body: T,
    userType: UserType,
  ): Promise<User> {
    const user = this._userRepo.create({
      ...body,
      isVerified: false,
      userType,
      status:
        userType === UserType.ADMIN ? UserStatus.PENDING : UserStatus.APPROVED, // set status based on role
    });
    return this.saveUser(user);
  }
  /**
   * Create user with role
   * @param body
   * @returns
   */
  async createUser(body: CreateLoginDto): Promise<User> {
    return this._createWithRole(body, UserType.USER);
  }

  /**
   * Create admin with role
   * @param body
   * @returns
   */
  async createAdmin(body: CreateAdminDto): Promise<User> {
    return this._createWithRole(body, UserType.ADMIN);
  }

  /**
   * Create user by admin with response
   * @param body
   * @returns
   */
  async createUserByAdmin(
    body: CreateLoginDto,
  ): Promise<{ user: User; message: string }> {
    let user = await this.findUserByEmail(body.email);
    if (user) {
      throw new BadRequestException('User with this email already exists');
    }
    const createdUser = await this.createUser(body);
    return {
      message: 'User has been created successfully',
      user: createdUser,
    };
  }

  /**
   * Create admin by admin with response
   * @param body
   * @returns
   */
  async createAdminByAdmin(
    body: CreateAdminDto,
  ): Promise<{ user: User; message: string }> {
    let admin = await this.findAdminByEmail(body.email);
    if (admin) {
      throw new BadRequestException('Admin with this email already exists');
    }
    const createdAdmin = await this.createAdmin(body);
    return {
      message: 'Admin has been created successfully',
      user: createdAdmin,
    };
  }

  saveUser(user: User): Promise<User> {
    return this._userRepo.save(user);
  }
  /**
   * find user by email
   */
  findUserByEmail(email: string): Promise<User | null> {
    return this._userRepo.findOneBy({ email, userType: UserType.USER });
  }

  /**
   * find admin by email
   */
  findAdminByEmail(email: string): Promise<User | null> {
    return this._userRepo.findOne({
      where: {
        email,
        userType: Not(UserType.USER),
      },
    });
  }
  /**
   * find admin or user by email
   */
  findUserAdminByEmail(email: string): Promise<User | null> {
    return this._userRepo.findOneBy({ email });
  }

  /**
   * find user by id (with joined events relation)
   */
  findUserById(id: number): Promise<User | null> {
    return this._userRepo.findOne({
      where: { id, userType: UserType.USER },
      relations: {
        joinedEvents: {
          event: true,
        },
      },
    });
  }
  /**
   * find admin by id (with created events and roles relation)
   */
  findAdminById(id: number): Promise<User | null> {
    return this._userRepo.findOne({
      where: { id, userType: UserType.ADMIN },
      relations: {
        createdEvents: true,
        roles: true,
      },
    });
  }
  /**
   * find user or admin by id
   */
  findById(id: number): Promise<User | null> {
    return this._userRepo.findOneBy({ id });
  }
  /**
   * Get admins by ids
   */
  async findAdminsByIds(ids: number[]): Promise<User[]> {
    if (!ids || ids.length === 0) {
      return [];
    }
    const admins = await this._userRepo.find({
      where: { id: In(ids.map((id) => Number(id))) },
    });
    return admins;
  }
  /**
   * get users or admins with pagination
   */

  async findUsers(
    { page = 1, perPage = 10 }: SearchUserDto,
    userType: UserType,
  ): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * perPage;
    const [users, total] = await this._userRepo.findAndCount({
      skip,
      take: perPage,
      where: { userType },
    });
    return {
      data: users,
      meta: {
        total,
        page,
        perPage,
      },
    };
  }

  /**
   * Remove user or admin
   * @param id
   * @returns
   */
  async removeUser(
    id: number,
    userType: UserType,
  ): Promise<{ user: User; message: string }> {
    const user = await this.findById(id);
    const userTypeStr = userType === UserType.ADMIN ? 'Admin' : 'User';
    if (!user) {
      throw new NotFoundException(`${userTypeStr} Not Found`);
    }
    const removedUser = await this._userRepo.remove(user);
    return {
      message: `${userTypeStr} has been deleted successfully`,
      user: removedUser,
    };
  }
  /**
   * Approve admin
   * @param adminId
   * @returns
   */
  async approveAdmin(
    adminId: number,
  ): Promise<{ user: User; message: string }> {
    const admin = await this.findAdminById(adminId);
    if (!admin) throw new NotFoundException('Admin not found');
    admin.status = UserStatus.APPROVED;
    const approvedUser = await this.saveUser(admin);
    return {
      message: 'Admin has been approved successfully',
      user: approvedUser,
    };
  }

  /**
   * Create super admin for seeder
   */
  async createSuperAdmin() {
    const existing = await this._userRepo.findOne({
      where: { email: 'test@gmail.com' },
    });
    if (existing) {
      const errMessage: string = '⚠️ Super admin already exists';
      throw new BadRequestException(errMessage);
    }
    const user = this._userRepo.create({
      firstname: 'Super Admin',
      lastname: 'Seeder',
      email: 'test@gmail.com',
      phone: '0000000000',
      isVerified: true,
      status: UserStatus.APPROVED,
      userType: UserType.ADMIN,
    });
    return this._userRepo.save(user);
  }
}
