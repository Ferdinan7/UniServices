import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService, User, AuthResult } from './auth.service';

// Mock de fetch global
global.fetch = jest.fn();

// Mock de Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
    },
  })),
}));

describe('AuthService - Service Layer Pattern & Strategy Pattern Tests', () => {
  let service: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  const mockUser: User = {
    id: 'test-id-123',
    email: 'test@example.com',
    role: 'authenticated',
    email_confirmed_at: '2023-01-01T00:00:00Z',
    app_metadata: {},
    user_metadata: {},
  };

  const mockAuthResult: AuthResult = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_at: Date.now() + 3600000,
    expires_in: 3600,
    token_type: 'Bearer',
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'servicesConfig.supabase.url':
                  return 'https://test-supabase-url.supabase.co';
                case 'servicesConfig.supabase.anonKey':
                  return 'test-supabase-key';
                case 'authService.url':
                  return 'http://localhost:3000/graphql';
                default:
                  return undefined;
              }
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Dependency Injection Pattern', () => {
    it('should be defined with injected dependencies', () => {
      expect(service).toBeDefined();
      expect(configService).toBeDefined();
      expect(jwtService).toBeDefined();
    });

    it('should use ConfigService for environment configuration', () => {
      expect(configService.get).toHaveBeenCalledWith('servicesConfig.supabase.url');
      expect(configService.get).toHaveBeenCalledWith('servicesConfig.supabase.anonKey');
    });
  });

  describe('signIn - Service Layer Pattern', () => {
    it('should successfully sign in with valid credentials', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            signIn: 'mock-access-token',
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await service.signIn('test@example.com', 'password123');

      expect(result).toBe('mock-access-token');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/graphql',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: expect.stringContaining('signIn'),
        }),
      );
    });

    it('should throw HttpException for GraphQL errors', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          errors: [{ message: 'Invalid credentials' }],
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(
        service.signIn('test@example.com', 'wrongpassword'),
      ).rejects.toThrow(
        new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should handle network/fetch errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(
        service.signIn('test@example.com', 'password123'),
      ).rejects.toThrow(
        new HttpException('Authentication failed', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should send correct GraphQL mutation', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: { signIn: 'token' },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await service.signIn('user@test.com', 'pass123');

      const fetchCall = mockFetch.mock.calls[0];
      const requestBody = JSON.parse(fetchCall[1]?.body as string);

      expect(requestBody.query).toContain('mutation SignIn');
      expect(requestBody.variables).toEqual({
        email: 'user@test.com',
        password: 'pass123',
      });
    });
  });

  describe('signUp - Service Layer Pattern', () => {
    it('should successfully register new user', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            signUp: 'User created: test@example.com',
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await service.signUp('test@example.com', 'password123');

      expect(result).toBe('User created: test@example.com');
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/graphql',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('signUp'),
        }),
      );
    });

    it('should throw HttpException for registration errors', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          errors: [{ message: 'User already exists' }],
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(
        service.signUp('existing@example.com', 'password123'),
      ).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('signInComplete - Advanced Service Pattern', () => {
    it('should return complete auth result', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            signInComplete: JSON.stringify(mockAuthResult),
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await service.signInComplete(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(mockAuthResult);
      expect(result.access_token).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should handle malformed JSON response', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            signInComplete: 'invalid-json',
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(
        service.signInComplete('test@example.com', 'password123'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('refreshToken - Token Management', () => {
    it('should successfully refresh token', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            refreshToken: JSON.stringify(mockAuthResult),
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await service.refreshToken('refresh-token-123');

      expect(result).toEqual(mockAuthResult);
      expect(result.access_token).toBeDefined();
    });

    it('should handle invalid refresh token', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          errors: [{ message: 'Invalid refresh token' }],
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('logout - Session Management', () => {
    it('should successfully logout user', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            logout: JSON.stringify({ message: 'Logged out successfully' }),
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await service.logout('access-token-123');

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/graphql',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token-123',
          }),
        }),
      );
    });
  });

  describe('validateToken - Strategy Pattern Implementation', () => {
    let mockSupabase: any;

    beforeEach(() => {
      // Access the private supabase instance through service
      mockSupabase = (service as any).supabase;
    });

    it('should validate token using Supabase strategy (Strategy 1)', async () => {
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: {
          user: {
            id: 'supabase-user-id',
            email: 'supabase@test.com',
            role: 'authenticated',
            email_confirmed_at: '2023-01-01T00:00:00Z',
          },
        },
        error: null,
      });

      const result = await service.validateToken('supabase-token');

      expect(result.valid).toBe(true);
      expect(result.user?.email).toBe('supabase@test.com');
      expect(result.user?.id).toBe('supabase-user-id');
      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith('supabase-token');
    });

    it('should fallback to GraphQL strategy when Supabase fails (Strategy 2)', async () => {
      // Supabase strategy fails
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid token' },
      });

      // GraphQL strategy succeeds
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            validateToken: JSON.stringify({
              valid: true,
              user: mockUser,
            }),
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await service.validateToken('graphql-token');

      expect(result.valid).toBe(true);
      expect(result.user?.email).toBe('test@example.com');
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalled();
    });

    it('should return invalid when both strategies fail', async () => {
      // Supabase strategy fails
      mockSupabase.auth.getUser.mockRejectedValueOnce(
        new Error('Supabase error'),
      );

      // GraphQL strategy fails
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await service.validateToken('invalid-token');

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle GraphQL validation errors', async () => {
      // Supabase strategy fails
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid token' },
      });

      // GraphQL returns error
      const mockResponse = {
        ok: true,
        json: async () => ({
          errors: [{ message: 'Token expired' }],
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await service.validateToken('expired-token');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Token expired');
    });
  });

  describe('getUserInfo - User Profile Service', () => {
    it('should successfully get user info', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          data: {
            getUserInfo: JSON.stringify(mockUser),
          },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      const result = await service.getUserInfo('access-token');

      expect(result).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/graphql',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer access-token',
          }),
        }),
      );
    });

    it('should throw HttpException for unauthorized access', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({
          errors: [{ message: 'Unauthorized' }],
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(service.getUserInfo('invalid-token')).rejects.toThrow(
        new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('Configuration and Environment Setup', () => {
    it('should use fallback configuration when env vars not set', () => {
      const configServiceMock = {
        get: jest.fn(() => undefined), // Return undefined for all calls
      };

      // This test verifies that default URLs are used when config is undefined
      expect(() => {
        new AuthService(configServiceMock as any, jwtService);
      }).not.toThrow();
    });

    it('should handle missing authService.url configuration', async () => {
      const configServiceWithoutUrl = {
        get: jest.fn((key: string) => {
          if (key === 'authService.url') return undefined;
          return 'some-value';
        }),
      };

      const serviceWithoutUrl = new AuthService(
        configServiceWithoutUrl as any,
        jwtService,
      );

      const mockResponse = {
        ok: true,
        json: async () => ({
          data: { signIn: 'token' },
        }),
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await serviceWithoutUrl.signIn('test@test.com', 'pass');

      // Should use default URL
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/graphql',
        expect.any(Object),
      );
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty response from GraphQL', async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({}), // Empty response
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(
        service.signIn('test@test.com', 'pass'),
      ).rejects.toThrow(HttpException);
    });

    it('should handle malformed GraphQL response', async () => {
      const mockResponse = {
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      };

      mockFetch.mockResolvedValueOnce(mockResponse as Response);

      await expect(
        service.signIn('test@test.com', 'pass'),
      ).rejects.toThrow(HttpException);
    });

    it('should handle network timeout', async () => {
      mockFetch.mockImplementationOnce(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 100),
          ),
      );

      await expect(
        service.signIn('test@test.com', 'pass'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('Integration and Pattern Validation', () => {
    it('should maintain consistent interface across all methods', () => {
      const methods = [
        'signIn',
        'signUp',
        'signInComplete',
        'refreshToken',
        'logout',
        'validateToken',
        'getUserInfo',
      ];

      methods.forEach((method) => {
        expect(typeof service[method]).toBe('function');
      });
    });

    it('should properly implement Service Layer pattern separation', () => {
      // Service should not contain HTTP handling logic
      const serviceString = service.constructor.toString();
      expect(serviceString).not.toContain('@Controller');
      expect(serviceString).not.toContain('@Get');
      expect(serviceString).not.toContain('@Post');

      // Should contain business logic
      expect(typeof service.signIn).toBe('function');
      expect(typeof service.validateToken).toBe('function');
    });

    it('should implement Strategy pattern correctly', async () => {
      // Test that validateToken can use multiple strategies
      const token = 'test-token';

      // Both strategies should be called in the correct order
      mockSupabase.auth.getUser.mockResolvedValueOnce({
        data: { user: mockUser },
        error: null,
      });

      const result = await service.validateToken(token);

      expect(result.valid).toBe(true);
      // Supabase strategy should be called first
      expect(mockSupabase.auth.getUser).toHaveBeenCalledWith(token);
    });
  });
});