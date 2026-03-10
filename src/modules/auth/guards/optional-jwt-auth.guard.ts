import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This guard extends the default JWT AuthGuard to make authentication optional.
 * If a valid JWT is provided, the user will be authenticated and available in the request.
 * If no JWT is provided or if the JWT is invalid, the request will still proceed without authentication.
 * (NO FORBIDDEN EXCEPTION WILL BE THROWN FOR UNAUTHENTICATED REQUESTS)
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err) {
      throw err;
    }

    return user ?? null;
  }
}