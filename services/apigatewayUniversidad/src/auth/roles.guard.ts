import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export enum Role {
  ADMIN = 'admin',
  STUDENT = 'estudiante',
  AUTHENTICATED = 'authenticated',
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    const hasRole = requiredRoles.some((role) => {
      // Check if user has the exact role
      if (user.role === role) {
        return true;
      }

      // Check in app_metadata.roles if exists
      if (user.app_metadata?.roles?.includes(role)) {
        return true;
      }

      // Check in user_metadata.roles if exists
      if (user.user_metadata?.roles?.includes(role)) {
        return true;
      }

      return false;
    });

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
