import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';

// Temporary simplified resolver - GraphQL will be configured later
@Injectable()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  async signIn(email: string, password: string): Promise<string> {
    return this.authService.signIn(email, password);
  }

  async signInComplete(email: string, password: string): Promise<string> {
    const result = await this.authService.signInComplete(email, password);
    return JSON.stringify(result);
  }

  async refreshToken(refresh_token: string): Promise<string> {
    const result = await this.authService.refreshToken(refresh_token);
    return JSON.stringify(result);
  }

  async logout(token: string): Promise<string> {
    const result = await this.authService.logout(token);
    return JSON.stringify(result);
  }

  async validateToken(token: string): Promise<string> {
    const result = await this.authService.validateToken(token);
    return JSON.stringify(result);
  }

  async getUserInfo(token: string): Promise<string> {
    const result = await this.authService.getUserInfo(token);
    return JSON.stringify(result);
  }
}
