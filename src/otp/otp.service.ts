import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MailService } from "../services/mail.service";
import { User } from "../users/user.entity";
import { Repository } from "typeorm";
import { Otp } from "./otp.entity";
import { OtpContext } from "./otp.type";

@Injectable()

export class OtpService {

    constructor(
        private _mailService: MailService,
        @InjectRepository(Otp) private _otpRepo: Repository<Otp>) { }

    /**
     * To send otp
     */
    async sendOtp(user: User, context: OtpContext) {
        // generate otp
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // create otp in db
        const otp = this._otpRepo.create({
            code: otpCode,
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 5 * 60 * 1000),
            context,
            user
        })
        // save otp in db
        await this._otpRepo.save(otp)
        // send otp
        await this._mailService.sendOtp(user.email, otpCode)

    }
    async verifyOtp(user: User, code: string, context: OtpContext): Promise<void> {
        const otp = await this._otpRepo.findOne({
            where: { user: { id: user.id }, context },
            order: { createdAt: 'DESC' },
        });

        if (!otp) throw new Error('No OTP found');
        if (otp.code !== code) throw new Error('Invalid OTP');
        if (otp.expiredAt.getTime() < Date.now()) throw new Error('Expired OTP');
    }
    /**
     * To get user otps
     */

    async getLastUserOtp(user: User): Promise<Otp | null> {
        return this._otpRepo.findOne({
            where: { user: { id: user.id } },
            order: { createdAt: 'DESC' },
        });
    }


}