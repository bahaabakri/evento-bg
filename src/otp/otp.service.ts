import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "src/services/mail.service";
import { User } from "src/users/user.entity";
import { Repository } from "typeorm";
import { Otp } from "./otp.entity";

@Injectable()

export class OtpService {

    constructor(
        private _mailService:MailService, 
        @InjectRepository(Otp) private _otpRepo:Repository<Otp>) {}

    /**
     * To send otp
     */
    async sendOtp(user: User) {

        // generate otp
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // create otp in db
        const otp = this._otpRepo.create({
            code: otpCode,
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 5 * 60 * 1000),
            user
        })
        // save otp in db
        await this._otpRepo.save(otp)
        // send otp
        await this._mailService.sendOtp(user.email, otpCode)

    }

    /**
     * To get user otps
     */

    async getLastUserOtp(user: User):Promise<Otp | null> {
        return this._otpRepo.findOne({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }


}