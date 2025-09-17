import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Not, Repository } from "typeorm";
import { Role } from "./roles.enum";
import { CreateLoginDto } from "../auth/dto/request/create-login.dto";
import { CreateAdminDto } from "src/auth/dto/request/create-admin.dto";
import { Status } from "./status.enum";
@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User) private _userRepo: Repository<User>,
    ) { }

    /////////////////////// Private Helper Functions ///////////////////////
    private async _createWithRole<T extends Partial<User>>(
        body: T,
        role: Role
    ): Promise<User> {
        const user = this._userRepo.create({
            ...body,
            isVerified: false,
            status: role === Role.ADMIN ? Status.PENDING : Status.APPROVED, // set status based on role
            role,
        });
        return this.saveUser(user);
    }
    /**
     * Create user with role
     * @param body 
     * @returns 
     */
    async createUser(body: CreateLoginDto): Promise<User> {
        return this._createWithRole(body, Role.USER);
    }

    /**
     * Create admin with role
     * @param body 
     * @returns 
     */
    async createAdmin(body: CreateAdminDto): Promise<User> {
        return this._createWithRole(body, Role.ADMIN);
    }

    /**
     * Approve admin
     * @param adminId 
     * @returns 
     */
    async approveAdmin(adminId: number): Promise<User> {
        const admin = await this._userRepo.findOne({ where: { id: adminId, role: Role.ADMIN } });
        if (!admin) throw new NotFoundException('Admin not found');
        admin.status = Status.APPROVED;
        return this.saveUser(admin);
    }

    saveUser(user: User): Promise<User> {
        return this._userRepo.save(user)
    }
    /**
     * find user by email
     */
    findUserByEmail(email: string): Promise<User | null> {
        return this._userRepo.findOneBy({ email, role: Role.USER })
    }

    /**
     * find admin by email
     */
    findAdminByEmail(email: string): Promise<User | null> {
        return this._userRepo.findOne({
            where: {
                email,
                role: Not(Role.USER),
            },
        });
    }
    /**
     * find admin or user by email
     */
    findUserAdminByEmail(email: string): Promise<User | null> {
        return this._userRepo.findOneBy({ email })
    }

    /**
     * find user by id
     */
    findUserById(id: number): Promise<User | null> {
        return this._userRepo.findOneBy({ id })
    }

    /**
     * get all users
     */

    findAllUsers(): Promise<User[]> {
        return this._userRepo.find()
    }


    /**
     * Remove user
     * @param id 
     * @returns 
     */
    async removeUser(id: number) {
        const user = await this.findUserById(id)
        if (!user) {
            throw new NotFoundException('User Not Found')
        }
        await this._userRepo.remove(user)
        return {
            message: 'User has been deleted successfully'
        }
    }
}