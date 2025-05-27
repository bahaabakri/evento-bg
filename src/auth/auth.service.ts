import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
// Update the import path below if the actual file name or location is different
import { UserService } from '../users/user.service';
import { OtpService } from '../otp/otp.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { Role } from '../users/roles.enum';

@Injectable()
export class AuthService {
    constructor(
        private _userService: UserService,
        private _otpService: OtpService,
    ) {}

    /**
     * create user if not exist and send otp
     * @param email 
     * @returns return user entity
     */
    async createLoginUser(body:CreateLoginDto): Promise<{user:User, message:string}> {
        // is this email exist
        let user = await this._userService.findUserByEmail(body.email)
        return this.createLoginUserAdmin(body, user)
    }

    /**
     * create admin if not exist and send otp
     * @param email 
     * @returns return user entity
     */
    async createLoginAdmin(body:CreateLoginDto): Promise<{user:User, message:string}> {
        // is this email exist
        let user = await this._userService.findAdminByEmail(body.email)
        return this.createLoginUserAdmin(body, user)
    }
    /**
     * create user or admin logic
     * @param email 
     * @returns return user entity
     */
    async createLoginUserAdmin(body:CreateLoginDto, user:User| null): Promise<{user:User, message:string}> {
        // is this email exist
        let message = ''
        message = 'Logged in Successfully'
        if (!user) {
            // create user
            user = await this._userService.createUser(body)
            message = 'User Created Successfully'
        }
        // send otp
        try {
            await this._otpService.sendOtp(user)
        } catch (error) {
            throw new BadRequestException('Unable to send otp, please try again')
        }
        message = message + ',and Otp has been send to your email address'
        return {
            user,
            message
        }
    }

    /**
     * Verify user
     */
    async verifyUser(email:string, enteredOtp:string): Promise<{user:User, message:string}> {
        // get user
        const user = await this._userService.findUserByEmail(email)
        return this.verifyUserAdmin(enteredOtp, user)
    }

    /**
     * Verify admin
     */
    async verifyAdmin(email:string, enteredOtp:string): Promise<{user:User, message:string}> {
        // get user
        const admin = await this._userService.findAdminByEmail(email)
        return this.verifyUserAdmin(enteredOtp, admin)
    }

     /**
     * Verify user or admin logic
     */
    async verifyUserAdmin(enteredOtp:string, user:User|null): Promise<{user:User, message:string}> {
        if(!user) {
            throw new NotFoundException('User Not Found');
        }
        // check if user has otp and NOT expired
        const dbOtp = await this._otpService.getLastUserOtp(user)
        if (!dbOtp) {
            throw new NotFoundException('No otp send to this user');
        }
        if (dbOtp.code !== enteredOtp) {
            throw new BadRequestException('Wrong otp, try again')
        }
        if (new Date(dbOtp.expiredAt).getTime() < new Date().getTime()) {
            throw new BadRequestException('Expired otp, try again')
        }
        const newUser = {...user, isVerified:true}
        const updatedUser = await this._userService.saveUser(newUser)
        return {
            user: updatedUser,
            message: 'User Verified Successfully'
        }
    }
}