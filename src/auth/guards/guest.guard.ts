/**
 * This guard explicitly and only allow unauthenticated user and forbidden authenticated user
 */
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Used to verify the token manually
import { ConfigService } from '@nestjs/config'; // Used to get the JWT secret
import { ExtractJwt } from 'passport-jwt'; // Helper to extract token from request

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request); // Try to extract the token

    if (!token) {
      // No token found in the request. The user is unauthenticated.
      // Allow the request to proceed to the endpoint (e.g., login or register).
      return true;
    }

    // If a token is found, we need to verify it to determine if the user is truly authenticated.
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (!jwtSecret) {
          // This is a critical configuration error. Application should not run without this.
          // In a real app, you might want to handle this more gracefully on app startup.
          throw new Error('JWT_SECRET is not configured in environment variables.');
      }

      // Verify the token. If it's valid (signed correctly, not expired),
      // then the user IS authenticated.
      await this.jwtService.verifyAsync(token, { secret: jwtSecret });

      // If verification succeeds, it means the user is authenticated.
      // According to your requirement, authenticated users should be forbidden.
      throw new ForbiddenException('Authenticated users are not allowed to access this endpoint.');

    } catch (e) {
      // If verification fails (e.g., token is expired, invalid signature, malformed token),
      // the user is effectively not authenticated (or has an invalid token).
      // Allow the request to proceed as if they were unauthenticated.
      return true;
    }
  }
}