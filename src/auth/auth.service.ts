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

    /**
     * create user if not exist and send otp
     * @param email 
     * @returns return user entity
     */
    async createLoginUser(body:CreateLoginDto): Promise<{user:User, message:string}> {
        // is this email exist
        let user = await this._userService.findUserByEmail(body.email)
        return this.createLoginUserAdmin(body, user, Role.USER)
    }

    /**
     * create admin if not exist and send otp
     * @param email 
     * @returns return user entity
     */
    async createLoginAdmin(body:CreateLoginDto, role:Exclude<Role, Role.USER> = Role.SUPER_ADMIN): Promise<{user:User, message:string}> {
        // is this email exist
        let user = await this._userService.findAdminByEmail(body.email)
        return this.createLoginUserAdmin(body, user, role)
    }
    /**
     * create user or admin logic
     * @param email 
     * @returns return user entity
     */
    async createLoginUserAdmin(body:CreateLoginDto, user:User| null, role:Role = Role.USER): Promise<{user:User, message:string}> {
        // is this email exist
        let message = ''
        message = 'Logged in Successfully'
        if (!user) {
            // create user
            user = await this._userService.createUser(body,role)
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
    async verifyUser(email:string, enteredOtp:string): Promise<{user:User, message:string, access_token:string}> {
        // get user
        const user = await this._userService.findUserByEmail(email)
        return this.verifyUserAdmin(enteredOtp, user)
    }

    /**
     * Verify admin
     */
    async verifyAdmin(email:string, enteredOtp:string): Promise<{user:User, message:string, access_token:string}> {
        // get user
        const admin = await this._userService.findAdminByEmail(email)
        return this.verifyUserAdmin(enteredOtp, admin)
    }

     /**
     * Verify user or admin logic
     */
    async verifyUserAdmin(enteredOtp:string, user:User|null): Promise<{user:User, message:string, access_token:string}> {
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
        return this.handleUserVerification(user)
    }

    /**
     * Login with google
     */
    async loginWithGoogle(accessToken:string) {
    try {
      const { data } = await lastValueFrom(
        this._httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      const { email, name, picture } = data;
      let user = await this._userService.findUserByEmail(email);
      if(!user) {
        // If user does not exist, create a new user
        user = await this._userService.createUser({email}, Role.USER);
      }
      return this.handleUserVerification(user);
    } catch (err) {
      throw new UnauthorizedException(err);
    }
    }

    private async handleUserVerification(user:User) {
        const newUser = {...user, isVerified:true}
        const updatedUser = await this._userService.saveUser(newUser)
          const payload = {
            sub: user.id, // 'sub' is standard for user ID
            email: user.email,
            isVerified: user.isVerified,
            role: user.role,
            // Add any other scalar properties you frequently need in the frontend
            // or for authorization decisions without another DB lookup
        };
        return {
            access_token: this._jwtService.sign(payload),
            user: updatedUser,
            message: 'User Verified Successfully'
        }
    }
}