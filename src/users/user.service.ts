import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { OtpService } from "src/otp/otp.service";

@Injectable()

export class UserService {
    constructor(
        @InjectRepository(User) private _userRepo:Repository<User>,
        private _otpService:OtpService
) {

    }

    async createUser(email) {
        // create user in db
        const user = this._userRepo.create({
            email: email,
            isVerified:false
        })
        // save user in db
        await this._userRepo.save(user)

        // send otp
        await this._otpService.sendOtp(user)

    }
}