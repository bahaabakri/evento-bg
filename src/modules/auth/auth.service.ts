import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/user.entity';
// Update the import path below if the actual file name or location is different
import { UserService } from '../users/user.service';
import { OtpService } from '../otp/otp.service';
import { CreateLoginDto } from './dto/request/create-login.dto';
import { Role } from '../users/roles.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { CreateAdminDto } from './dto/request/create-admin.dto';
import { Status } from '../users/status.enum';

@Injectable()
export class AuthService {
    private client
    constructor(
        private _userService: UserService,
        private _otpService: OtpService,
        private _jwtService: JwtService,
        private _configService: ConfigService,
        private _httpService: HttpService, // Ensure you have HttpService imported from @nestjs/axios
    ) {
        this.client = new OAuth2Client(this._configService.get<string>('GOOGLE_CLIENT_ID'))
    }

    /////////////////////// Private Helper Functions ///////////////////////

    private async _sendOtpOrFail(user: User): Promise<void> {
        try {
            await this._otpService.sendOtp(user, 'auth');
        } catch {
            throw new BadRequestException('Unable to send otp, please try again');
        }
    }

    private _buildResponse(user: User, message: string): { user: User; message: string } {
        return { user, message };
    }
    // Used for regular users
    private async _handleVerification(user: User) {
        user.isVerified = true;
        const updatedUser = await this._userService.saveUser(user);

        const payload = {
            sub: updatedUser.id,
            email: updatedUser.email,
            isVerified: updatedUser.isVerified,
            role: updatedUser.role,
        };

        return {
            access_token: this._jwtService.sign(payload),
            user: updatedUser,
            message: 'User Verified Successfully',
        };
    }

    /////////////////////// Public Functions ///////////////////////

    /** 
     * Create or login user 
     * @param body 
     * @returns
    **/
    async registerLoginUser(body: CreateLoginDto): Promise<{ user: User; message: string }> {
        let user = await this._userService.findUserByEmail(body.email);
        let message = user ? 'Logged in Successfully' : 'User Created Successfully';

        if (!user) {
            user = await this._userService.createUser(body);
        }

        await this._sendOtpOrFail(user);
        return this._buildResponse(user, `${message}, and Otp has been sent to your email address`);
    }

    /**
     * Create admin
     * @param body 
     * @param role 
     * @returns 
     */
    async registerAdmin(body: CreateAdminDto, role: Exclude<Role, Role.USER> = Role.ADMIN): Promise<{ user: User; message: string }> {
        const existing = await this._userService.findAdminByEmail(body.email);
        if (existing) throw new BadRequestException('Admin with this email already exists');

        const admin = await this._userService.createAdmin(body);
        await this._sendOtpOrFail(admin);

        return this._buildResponse(admin, 'Admin Created Successfully, and Otp has been sent to your email address');
    }

    /**
     * Login admin
     * @param body 
     * @param role 
     * @returns 
     */
    async loginAdmin(body: CreateLoginDto, role: Exclude<Role, Role.USER> = Role.ADMIN): Promise<{ user: User; message: string }> {
        const admin = await this._userService.findAdminByEmail(body.email);
        if (!admin) throw new NotFoundException('Admin with this email does not exist');
        if (admin.status !== Status.APPROVED) throw new ForbiddenException('Your admin account is not approved yet');
        await this._sendOtpOrFail(admin);
        return this._buildResponse(admin, 'Admin Logged in Successfully, and Otp has been sent to your email address');
    }
    /**
     * Verify user
     */
    async verifyUser(email: string, enteredOtp: string): Promise<{ user: User, message: string, access_token: string }> {
        // get user
        const user = await this._userService.findUserByEmail(email)
        if(!user) throw new NotFoundException('User with this email does not exist');
        await this._otpService.verifyOtp(user, enteredOtp, 'auth')
        return this._handleVerification(user);
    }

    /**
     * Verify admin
     */
    async verifyAdmin(email: string, enteredOtp: string): Promise<{ user: User, message: string, access_token: string }> {
        // get user
        const admin = await this._userService.findAdminByEmail(email)
        if(!admin) throw new NotFoundException('Admin with this email does not exist');
        await this._otpService.verifyOtp(admin, enteredOtp, 'auth')
        return this._handleVerification(admin);  
    }

    // /**
    // * Verify user or admin logic
    // */
    // async verifyUserAdmin(enteredOtp: string, user: User | null): Promise<{ user: User, message: string, access_token: string }> {
    //     if (!user) {
    //         throw new NotFoundException('User Not Found');
    //     }
    //     // check if user has otp and NOT expired
    //     const dbOtp = await this._otpService.getLastUserOtp(user)
    //     if (!dbOtp) {
    //         throw new NotFoundException('No otp send to this user');
    //     }
    //     if (dbOtp.code !== enteredOtp) {
    //         throw new BadRequestException('Wrong otp, try again')
    //     }
    //     if (new Date(dbOtp.expiredAt).getTime() < new Date().getTime()) {
    //         throw new BadRequestException('Expired otp, try again')
    //     }
    //     return this.handleUserVerification(user)
    // }

    /**
     * Login with google
     */
    async loginWithGoogle(accessToken: string) {
        try {
            const { data } = await lastValueFrom(
                this._httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }),
            );
            const { email, name, picture } = data;
            let user = await this._userService.findUserByEmail(email);
            if (!user) {
                // If user does not exist, create a new user
                user = await this._userService.createUser({ email });
            }
            return this._handleVerification(user);
        } catch (err) {
            throw new UnauthorizedException(err);
        }
    }
}