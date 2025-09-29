import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      throw new HttpException('Logout failed', HttpStatus.BAD_REQUEST);
    }
  }

  async validateToken(
    token: string,
  ): Promise<{ valid: boolean; user?: User; error?: string }> {
    // Validar usando el microservicio de auth
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
    } catch (error) {
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
    } catch (error) {
      throw new HttpException(
        'Failed to get user info',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
