import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { In, Not, Repository } from 'typeorm';
import SearchUserDto from './dto/request/search-user.dto';
import { PaginatedResult } from '@/types/types';
import { UserType } from './user-type.enum';
import { UserStatus } from './user-status.enum';
import { validateId } from '@/util';
import { CreateUpdateUserDto } from './dto/request/create-update-user.dto';
import { CreateUpdateAdminDto } from './dto/request/create-update-admin.dto';
@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private _userRepo: Repository<User>) {}

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
  async createUser(body: CreateUpdateUserDto): Promise<User> {
    return this._createWithRole(body, UserType.USER);
  }

  /**
   * Create admin with role
   * @param body
   * @returns
   */
  async createAdmin(body: CreateUpdateAdminDto): Promise<User> {
    return this._createWithRole(body, UserType.ADMIN);
  }

  /**
   * Create user by admin with response
   * @param body
   * @returns
   */
  async createUserByAdmin(
    body: CreateUpdateUserDto,
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
   * Update user by admin
   */
  async updateUserByAdmin(
    id: number,
    body: CreateUpdateUserDto,
  ): Promise<{ user: User; message: string }> {
    const savedUser = await this.findUserById(validateId(id));
    const updatedUser = {
      ...savedUser,
      ...body,
    };
    // in case body has email -> make is-verified false
    if (body.email) {
      // check if email already exists
      let user = await this.findUserByEmail(body.email);
      if (user && user.id !== validateId(id)) {
        throw new BadRequestException('User with this email already exists');
      }
      updatedUser.isVerified = false;
    }
    await this._userRepo.save(updatedUser);
    return {
      message: 'User has been updated successfully',
      user: updatedUser,
    };
  }

  /**
   * Create admin by admin with response
   * @param body
   * @returns
   */
  async createAdminByAdmin(
    body: CreateUpdateAdminDto,
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

  /**
   * Update admin by admin
   */
  async updateAdminByAdmin(
    id: number,
    body: CreateUpdateAdminDto,
  ): Promise<{ user: User; message: string }> {
    const savedAdmin = await this.findAdminById(validateId(id));
    let updatedAdmin = {
      ...savedAdmin,
      ...body,
    };
    // in case body has email -> make is-verified false
    if (body.email) {
      // check if email already exists
      let admin = await this.findAdminByEmail(body.email);
      if (admin && admin.id !== validateId(id)) {
        throw new BadRequestException('Admin with this email already exists');
      }
      updatedAdmin.isVerified = false;
    }
    await this._userRepo.save(updatedAdmin);
    return {
      message: 'User has been updated successfully',
      user: updatedAdmin,
    };
  }

  saveUser(user: User): Promise<User> {
    return this._userRepo.save(user);
  }
  /**
   * find user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new BadRequestException('Email should not be empty');
    }
    const user = await this._userRepo.findOneBy({
      email,
      userType: UserType.USER,
    });
    return user;
  }

  /**
   * find admin by email
   */
  async findAdminByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new BadRequestException('Email should not be empty');
    }
    const admin = await this._userRepo.findOne({
      where: {
        email,
        userType: Not(UserType.USER),
      },
    });
    return admin;
  }
  /**
   * find admin or user by email
   */
  async findUserAdminByEmail(email: string): Promise<User | null> {
    if (!email) {
      throw new BadRequestException('Email should not be empty');
    }
    const user = await this._userRepo.findOneBy({ email });
    return user;
  }

  /**
   * find user by id (with joined events relation)
   */
  async findUserById(id: number): Promise<User> {
    const user = await this._userRepo.findOne({
      where: { id: validateId(id), userType: UserType.USER },
      relations: {
        tickets: {
          event: true,
        },
        roles: false,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }
  /**
   * find admin by id (with created events and roles relation)
   */
  async findAdminById(id: number): Promise<User> {
    const admin = await this._userRepo.findOne({
      where: { id: validateId(id), userType: UserType.ADMIN },
      relations: {
        createdEvents: true,
        roles: true,
      },
    });
    if (!admin) {
      throw new NotFoundException('Admin Not Found');
    }
    return admin;
  }
  /**
   * find user or admin by id
   */
  async findById(id: number): Promise<User | null> {
    const user = await this._userRepo.findOneBy({ id: validateId(id) });
    return user;
  }
  /**
   * Get admins by ids
   */
  async findAdminsByIds(ids: number[]): Promise<User[]> {
    if (!ids.length) {
      return [];
    }
    // This will throw automatically if any ID is invalid
    ids.forEach((id) => validateId(id));
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
      // console.log(errMessage);
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
