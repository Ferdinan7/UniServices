import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createClient } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  role: string;
  email_confirmed_at?: string;
  app_metadata?: any;
  user_metadata?: any;
}

export interface AuthResult {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  user: User;
}

@Injectable()
export class AuthService {
  private supabase: any;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    const supabaseUrl =
      this.configService.get<string>('servicesConfig.supabase.url') ||
      'https://sirtkdkbqsklncyoallp.supabase.co';
    const supabaseKey =
      this.configService.get<string>('servicesConfig.supabase.anonKey') ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcnRrZGticXNrbG5jeW9hbGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg3NDMsImV4cCI6MjA3NDM0NDc0M30.B4EHoGBWHaW5RDPT0YbqVVrpwJ4EsWsKBt6yVbwQXAA';

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async signIn(email: string, password: string): Promise<string> {
    const authServiceUrl =
      this.configService.get<string>('authService.url') ??
      'http://localhost:3000/graphql';

    const query = `
      mutation SignIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password)
      }
    `;

    try {
      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { email, password },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new HttpException(
          data.errors[0].message,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return data.data.signIn;
    } catch {
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async signUp(email: string, password: string): Promise<string> {
    const authServiceUrl =
      this.configService.get<string>('authService.url') ??
      'http://localhost:3000/graphql';

    const query = `
      mutation SignUp($email: String!, $password: String!) {
        signUp(email: $email, password: $password)
      }
    `;

    try {
      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { email, password },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new HttpException(data.errors[0].message, HttpStatus.BAD_REQUEST);
      }

      return data.data.signUp;
    } catch {
      throw new HttpException(
        'User registration failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signInComplete(email: string, password: string): Promise<AuthResult> {
    const authServiceUrl =
      this.configService.get<string>('authService.url') ??
      'http://localhost:3000/graphql';

    const query = `
      mutation SignInComplete($email: String!, $password: String!) {
        signInComplete(email: $email, password: $password)
      }
    `;

    try {
      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { email, password },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new HttpException(
          data.errors[0].message,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return JSON.parse(data.data.signInComplete);
    } catch {
      throw new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async refreshToken(refresh_token: string): Promise<AuthResult> {
    const authServiceUrl =
      this.configService.get<string>('authService.url') ??
      'http://localhost:3000/graphql';

    const query = `
      mutation RefreshToken($refresh_token: String!) {
        refreshToken(refresh_token: $refresh_token)
      }
    `;

    try {
      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { refresh_token },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new HttpException(
          data.errors[0].message,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return JSON.parse(data.data.refreshToken);
    } catch {
      throw new HttpException('Token refresh failed', HttpStatus.UNAUTHORIZED);
    }
  }

  async logout(token: string): Promise<{ message: string }> {
    const authServiceUrl =
      this.configService.get<string>('authService.url') ??
      'http://localhost:3000/graphql';

    const query = `
      mutation Logout {
        logout
      }
    `;

    try {
      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new HttpException(data.errors[0].message, HttpStatus.BAD_REQUEST);
      }

      return JSON.parse(data.data.logout);
    } catch {
      throw new HttpException('Logout failed', HttpStatus.BAD_REQUEST);
    }
  }

  async validateToken(
    token: string,
  ): Promise<{ valid: boolean; user?: User; error?: string }> {
    // Intentar validar con Supabase primero (para tokens de Google OAuth)
    try {
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error) {
        console.log(
          'Supabase validation failed, trying GraphQL auth service...',
          error.message,
        );
        // Si falla Supabase, intentar con el servicio de auth GraphQL
        return await this.validateTokenWithGraphQL(token);
      }

      if (data?.user) {
        // Token de Supabase válido
        const user: User = {
          id: data.user.id,
          email: data.user.email || '',
          role: data.user.role || 'authenticated',
          email_confirmed_at: data.user.email_confirmed_at,
          app_metadata: data.user.app_metadata,
          user_metadata: data.user.user_metadata,
        };

        return { valid: true, user };
      }

      return { valid: false, error: 'Invalid token' };
    } catch (error) {
      console.error('Error validating token with Supabase:', error);
      // Intentar con GraphQL como fallback
      return await this.validateTokenWithGraphQL(token);
    }
  }

  private async validateTokenWithGraphQL(
    token: string,
  ): Promise<{ valid: boolean; user?: User; error?: string }> {
    try {
      const authServiceUrl =
        this.configService.get<string>('authService.url') ??
        'http://localhost:3000/graphql';

      const query = `
        query ValidateToken($token: String!) {
          validateToken(token: $token)
        }
      `;

      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { token },
        }),
      });

      const data = await response.json();
      if (data.errors) {
        return { valid: false, error: data.errors[0].message };
      }

      return JSON.parse(data.data.validateToken);
    } catch {
      return { valid: false, error: 'Token validation failed' };
    }
  }

  async getUserInfo(token: string): Promise<User> {
    const authServiceUrl =
      this.configService.get<string>('authService.url') ??
      'http://localhost:3000/graphql';

    const query = `
      query GetUserInfo {
        getUserInfo
      }
    `;

    try {
      const response = await fetch(authServiceUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (data.errors) {
        throw new HttpException(
          data.errors[0].message,
          HttpStatus.UNAUTHORIZED,
        );
      }

      return JSON.parse(data.data.getUserInfo);
    } catch {
      throw new HttpException(
        'Failed to get user info',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
