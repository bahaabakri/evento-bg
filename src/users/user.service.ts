import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { OtpService } from "src/otp/otp.service";

@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User) private _userRepo:Repository<User>,
        private _otpService:OtpService
    ) {}
    /**
     * create user if not exist and send otp
     * @param email 
     * @returns return user entity
     */
    async createOrLoginUser(email:string): Promise<{user:User, message:string}> {
        // is this email exist
        let message = ''
        let user = await this.findUserByEmail(email)
        message = 'Logged in Successfully'
        if (!user) {
            // create user
            user = await this.createUser(email)
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
     * create user in db
     * @param email 
     * @returns 
     */
    async createUser(email:string) {
        // create user in db
        const user = this._userRepo.create({
            email: email,
            isVerified:false
        })
        // save user in db
        return this._userRepo.save(user)
    }
    /**
     * find user by email
     */
    findUserByEmail(email:string):Promise<User | null> {
        return this._userRepo.findOneBy({email})
    }

    /**
     * find user by id
     */
    findUserById(id:number):Promise<User | null> {
        return this._userRepo.findOneBy({id})
    }

    /**
     * Verify user
     */
    async verifyUser(email:string, enteredOtp:string): Promise<{user:User, message:string}> {
        // get user
        const user = await this.findUserByEmail(email)
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
        const updatedUser = await this._userRepo.save(newUser)
        return {
            user: updatedUser,
            message: 'User Verified Successfully'
        }
    }


    async removeUser(id:number) {
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