import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Not, Repository } from 'typeorm';
import { CreateLoginDto } from '../auth/dto/request/create-login.dto';
import { CreateAdminDto } from '@/modules/auth/dto/request/create-admin.dto';
import SearchUserDto from './dto/request/search-user.dto';
import { PaginatedResult } from '@/types/types';
import { UserType } from './user-type.enum';
import { UserStatus } from './user-status.enum';
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
      status: userType === UserType.ADMIN ? UserStatus.PENDING : UserStatus.APPROVED, // set status based on role
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
   * find user by id
   */
  findUserById(id: number): Promise<User | null> {
    return this._userRepo.findOne({
      where: { id, userType: UserType.USER },
      relations: {
        joinedEvents: {
          event: true,
        },
        createdEvents: true,
      },
    });
  }
  /**
   * find admin by id
   */
  findAdminById(id: number): Promise<User | null> {
    return this._userRepo.findOne({
      where: { id, userType: Not(UserType.USER) },
    });
  }
  /**
   * find user or admin by id
   */
  findById(id: number): Promise<User | null> {
    return this._userRepo.findOneBy({ id });
  }

  /**
   * get all users
   */

  async findUsers({
    page = 1,
    perPage = 10,
  }: SearchUserDto): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * perPage;
    const [users, total] = await this._userRepo.findAndCount({
      skip,
      take: perPage,
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
   * Remove user
   * @param id
   * @returns
   */
  async removeUser(id: number): Promise<{ user: User; message: string }> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const removedUser = await this._userRepo.remove(user);
    return {
      message: 'User has been deleted successfully',
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
}
