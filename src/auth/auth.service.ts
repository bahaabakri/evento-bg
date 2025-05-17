import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';
// Update the import path below if the actual file name or location is different
import { UserService } from 'src/users/user.service';
import { OtpService } from 'src/otp/otp.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { Role } from 'src/users/roles.enum';

@Injectable()
export class AuthService {
    constructor(
        private _userService: UserService,
        private _otpService: OtpService,
    ) {}

    /**
     * create admin if not exist and send otp
     * @param body 
     * @returns return user entity
     */
    async createLoginAdmin(body:CreateLoginDto): Promise<{admin:User, message:string}> {
        let message = ''
        let admin = await this._userService.findAdminByEmail(body.email)
        message = 'Logged in Successfully'
        if (!admin) {
            // create admin
            admin = await this._userService.createUser(body, Role.ADMIN)
            message = 'Admin Created Successfully'
        }
        // send otp
        await this._otpService.sendOtp(admin)
        message = message + ',and Otp has been send to your email address'
        return {
            admin,
            message
        }
    }
    /**
     * create user if not exist and send otp
     * @param email 
     * @returns return user entity
     */
    async createLoginUser(body:CreateLoginDto): Promise<{user:User, message:string}> {
        // is this email exist
        let message = ''
        let user = await this._userService.findUserByEmail(body.email)
        message = 'Logged in Successfully'
        if (!user) {
            // create user
            user = await this._userService.createUser(body)
            message = 'User Created Successfully'
        }
        // send otp
        await this._otpService.sendOtp(user)
        message = message + ',and Otp has been send to your email address'
        return {
            user,
            message
        }
    }

    /**
     * Verify user
     */
    async verifyUserAdmin(email:string, enteredOtp:string): Promise<{user:User, message:string}> {
        // get user
        const user = await this._userService.findUserAdminByEmail(email)
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