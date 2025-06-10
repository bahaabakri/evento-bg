// src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // <-- Import ConfigService
import { UserService } from 'src/users/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private _userService: UserService,
    private _configService: ConfigService, // <-- Inject ConfigService here
  ) {
    super({
      // Method to extract the JWT from the incoming request
      // This expects the token in the 'Authorization' header as 'Bearer YOUR_TOKEN'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Set to false to ensure that tokens with an expired 'exp' claim are rejected
      ignoreExpiration: false,

      // The secret key used to sign the JWT.
      // This MUST match the secret configured in your JwtModule.registerAsync()
      secretOrKey: _configService.get<string>('JWT_SECRET')!, // <-- Get secret from ConfigService
    });
  }

  /**
   * This method is called automatically by Passport-JWT after the token has been successfully
   * extracted, the signature verified, and the expiration checked.
   *
   * @param payload - The decoded JWT payload (e.g., { sub: userId, username: '...' }).
   * This is the data you originally signed into the token.
   * @returns The user object that will be attached to `req.user`.
   * @throws UnauthorizedException if the user corresponding to the payload is not found or is invalid.
   */
  async validate(payload: any) {
    // In this example, 'payload.sub' is assumed to be the user's unique ID.
    // You fetch the user from your database based on this ID.
    // This step ensures that the user still exists and is active.
    const user = await this._userService.findUserById(payload.sub); // Adjust based on your UsersService method

    if (!user) {
      // If the user doesn't exist in the database (e.g., deleted account),
      // throw an UnauthorizedException to reject the request.
      throw new UnauthorizedException('User not found or no longer active.');
    }

    // IMPORTANT: Whatever you return from this validate method will be
    // attached to the `req.user` object in your route handlers.
    // For example, if you return `user` here, then in your controllers
    // `req.user` will be the full user object from your database.
    return user;
  }
}