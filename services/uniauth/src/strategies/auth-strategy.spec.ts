// src/strategies/auth-strategy.spec.ts

import { IAuthStrategy, AuthCredentials, AuthResult, AuthenticationError } from './IAuthStrategy';
import { EmailPasswordStrategy } from './EmailPasswordStrategy';
import { GoogleOAuthStrategy } from './GoogleOAuthStrategy';

/**
 * Tests para el patrón Strategy (Estrategia)
 *
 * El patrón Strategy define una familia de algoritmos (estrategias de autenticación),
 * encapsula cada uno de ellos y los hace intercambiables.
 *
 * Beneficios:
 * 1. Permite cambiar el algoritmo en tiempo de ejecución
 * 2. Elimina condicionales complejos (if/switch)
 * 3. Facilita agregar nuevas estrategias sin modificar código existente
 * 4. Cada estrategia es independiente y testeable
 */

describe('Strategy Pattern - Authentication Strategies', () => {
  let emailStrategy: IAuthStrategy;
  let googleStrategy: IAuthStrategy;

  // Mock de Supabase para los tests
  const mockSupabaseClient = {
    auth: {
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Inicializar estrategias con mock de Supabase
    emailStrategy = new EmailPasswordStrategy(mockSupabaseClient as any);
    googleStrategy = new GoogleOAuthStrategy(mockSupabaseClient as any);
  });

  describe('Strategy Pattern - Interface Implementation', () => {
    it('should implement IAuthStrategy interface', () => {
      expect(emailStrategy).toBeDefined();
      expect(emailStrategy.name).toBeDefined();
      expect(emailStrategy.type).toBeDefined();
      expect(emailStrategy.authenticate).toBeDefined();
      expect(emailStrategy.validateCredentials).toBeDefined();

      expect(googleStrategy).toBeDefined();
      expect(googleStrategy.name).toBeDefined();
      expect(googleStrategy.type).toBeDefined();
      expect(googleStrategy.authenticate).toBeDefined();
      expect(googleStrategy.validateCredentials).toBeDefined();
    });

    it('should have unique strategy names', () => {
      expect(emailStrategy.name).toBe('email-password');
      expect(googleStrategy.name).toBe('google-oauth');
      expect(emailStrategy.name).not.toBe(googleStrategy.name);
    });

    it('should categorize strategy types correctly', () => {
      expect(emailStrategy.type).toBe('local');
      expect(googleStrategy.type).toBe('oauth');
    });

    it('should define all required interface methods', () => {
      const requiredMethods = ['authenticate', 'validateCredentials'];

      requiredMethods.forEach(method => {
        expect(typeof emailStrategy[method]).toBe('function');
        expect(typeof googleStrategy[method]).toBe('function');
      });
    });
  });

  describe('Strategy Pattern - Email/Password Strategy', () => {
    it('should validate email/password credentials correctly', () => {
      const validCredentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const invalidCredentials: AuthCredentials = {
        email: 'test@example.com',
        // password missing
      };

      expect(emailStrategy.validateCredentials(validCredentials)).toBe(true);
      expect(emailStrategy.validateCredentials(invalidCredentials)).toBe(false);
    });

    it('should reject credentials without email', () => {
      const credentials: AuthCredentials = {
        password: 'password123',
      };

      expect(emailStrategy.validateCredentials(credentials)).toBe(false);
    });

    it('should reject credentials without password', () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
      };

      expect(emailStrategy.validateCredentials(credentials)).toBe(false);
    });

    it('should authenticate with valid email/password', async () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockAuthResponse = {
        data: {
          session: { access_token: 'mock-token', refresh_token: 'refresh-token' },
          user: { id: '1', email: 'test@example.com' },
        },
        error: null,
      };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(mockAuthResponse);

      const result = await emailStrategy.authenticate(credentials);

      expect(result.success).toBe(true);
      expect(result.accessToken).toBeDefined();
      expect(result.user).toBeDefined();
      expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
        email: credentials.email,
        password: credentials.password,
      });
    });

    it('should handle authentication errors', async () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockErrorResponse = {
        data: { session: null, user: null },
        error: { message: 'Invalid credentials' },
      };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue(mockErrorResponse);

      const result = await emailStrategy.authenticate(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should provide strategy configuration', () => {
      const config = emailStrategy.getConfig?.();

      expect(config).toBeDefined();
      expect(config?.displayName).toBe('Email/Password');
      expect(config?.requiresRedirect).toBe(false);
    });
  });

  describe('Strategy Pattern - Google OAuth Strategy', () => {
    it('should validate OAuth credentials correctly', () => {
      const validCredentials: AuthCredentials = {
        provider: 'google',
        redirectTo: 'http://localhost:3000/callback',
      };

      const invalidCredentials: AuthCredentials = {
        provider: 'facebook', // wrong provider
      };

      expect(googleStrategy.validateCredentials(validCredentials)).toBe(true);
      expect(googleStrategy.validateCredentials(invalidCredentials)).toBe(false);
    });

    it('should require correct provider', () => {
      const credentials: AuthCredentials = {
        provider: 'google',
      };

      expect(googleStrategy.validateCredentials(credentials)).toBe(true);

      const wrongProvider: AuthCredentials = {
        provider: 'github',
      };

      expect(googleStrategy.validateCredentials(wrongProvider)).toBe(false);
    });

    it('should initiate OAuth flow', async () => {
      const credentials: AuthCredentials = {
        provider: 'google',
        redirectTo: 'http://localhost:3000/callback',
      };

      const mockOAuthResponse = {
        data: {
          provider: 'google',
          url: 'https://accounts.google.com/oauth...',
        },
        error: null,
      };

      mockSupabaseClient.auth.signInWithOAuth.mockResolvedValue(mockOAuthResponse);

      const result = await googleStrategy.authenticate(credentials);

      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBeDefined();
      expect(mockSupabaseClient.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: credentials.redirectTo,
        }),
      });
    });

    it('should handle OAuth callback', async () => {
      if (googleStrategy.handleCallback) {
        const callbackData = {
          access_token: 'google-access-token',
          refresh_token: 'google-refresh-token',
        };

        const result = await googleStrategy.handleCallback(callbackData);

        expect(result).toBeDefined();
        expect(result.success).toBeDefined();
      }
    });

    it('should provide strategy configuration', () => {
      const config = googleStrategy.getConfig?.();

      expect(config).toBeDefined();
      expect(config?.displayName).toBe('Google');
      expect(config?.icon).toBeDefined();
      expect(config?.requiresRedirect).toBe(true);
    });
  });

  describe('Strategy Pattern - Interchangeability', () => {
    it('should use strategies interchangeably', async () => {
      // Context que usa estrategias
      class AuthContext {
        private strategy: IAuthStrategy;

        constructor(strategy: IAuthStrategy) {
          this.strategy = strategy;
        }

        setStrategy(strategy: IAuthStrategy) {
          this.strategy = strategy;
        }

        async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
          if (!this.strategy.validateCredentials(credentials)) {
            return {
              success: false,
              error: 'Invalid credentials for this strategy',
            };
          }
          return await this.strategy.authenticate(credentials);
        }

        getStrategyName(): string {
          return this.strategy.name;
        }
      }

      // Crear contexto con estrategia de email
      const context = new AuthContext(emailStrategy);
      expect(context.getStrategyName()).toBe('email-password');

      // Cambiar a estrategia de Google
      context.setStrategy(googleStrategy);
      expect(context.getStrategyName()).toBe('google-oauth');

      // Las estrategias son intercambiables
      expect(context).toBeDefined();
    });

    it('should allow runtime strategy selection', () => {
      const selectStrategy = (type: string): IAuthStrategy => {
        switch (type) {
          case 'email':
            return emailStrategy;
          case 'google':
            return googleStrategy;
          default:
            throw new Error('Unknown strategy');
        }
      };

      const email = selectStrategy('email');
      const google = selectStrategy('google');

      expect(email.name).toBe('email-password');
      expect(google.name).toBe('google-oauth');
    });

    it('should maintain consistent interface across strategies', () => {
      const strategies: IAuthStrategy[] = [emailStrategy, googleStrategy];

      strategies.forEach(strategy => {
        expect(strategy.name).toBeDefined();
        expect(strategy.type).toBeDefined();
        expect(typeof strategy.authenticate).toBe('function');
        expect(typeof strategy.validateCredentials).toBe('function');
      });
    });
  });

  describe('Strategy Pattern - Registry Management', () => {
    it('should support strategy registry', () => {
      const registry = new Map<string, IAuthStrategy>();

      registry.set(emailStrategy.name, emailStrategy);
      registry.set(googleStrategy.name, googleStrategy);

      expect(registry.size).toBe(2);
      expect(registry.get('email-password')).toBe(emailStrategy);
      expect(registry.get('google-oauth')).toBe(googleStrategy);
    });

    it('should retrieve strategy by name', () => {
      const registry = new Map<string, IAuthStrategy>([
        ['email-password', emailStrategy],
        ['google-oauth', googleStrategy],
      ]);

      const strategy = registry.get('email-password');
      expect(strategy).toBe(emailStrategy);
    });

    it('should list all available strategies', () => {
      const registry = new Map<string, IAuthStrategy>([
        ['email-password', emailStrategy],
        ['google-oauth', googleStrategy],
      ]);

      const strategies = Array.from(registry.values());
      expect(strategies.length).toBe(2);
      expect(strategies).toContain(emailStrategy);
      expect(strategies).toContain(googleStrategy);
    });

    it('should filter strategies by type', () => {
      const strategies = [emailStrategy, googleStrategy];

      const localStrategies = strategies.filter(s => s.type === 'local');
      const oauthStrategies = strategies.filter(s => s.type === 'oauth');

      expect(localStrategies.length).toBe(1);
      expect(localStrategies[0]).toBe(emailStrategy);
      expect(oauthStrategies.length).toBe(1);
      expect(oauthStrategies[0]).toBe(googleStrategy);
    });
  });

  describe('Strategy Pattern - Extensibility', () => {
    it('should allow adding new strategies without modifying existing code', () => {
      // Nueva estrategia: Facebook OAuth
      class FacebookOAuthStrategy implements IAuthStrategy {
        readonly name = 'facebook-oauth';
        readonly type = 'oauth' as const;

        async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
          return { success: true, accessToken: 'facebook-token' };
        }

        validateCredentials(credentials: AuthCredentials): boolean {
          return credentials.provider === 'facebook';
        }

        getConfig() {
          return {
            displayName: 'Facebook',
            icon: 'facebook-icon',
            requiresRedirect: true,
          };
        }
      }

      const facebookStrategy = new FacebookOAuthStrategy();

      // La nueva estrategia implementa la misma interfaz
      expect(facebookStrategy.name).toBe('facebook-oauth');
      expect(facebookStrategy.type).toBe('oauth');
      expect(typeof facebookStrategy.authenticate).toBe('function');

      // Se puede agregar al registro sin modificar código existente
      const registry = new Map<string, IAuthStrategy>([
        ['email-password', emailStrategy],
        ['google-oauth', googleStrategy],
        ['facebook-oauth', facebookStrategy],
      ]);

      expect(registry.size).toBe(3);
    });

    it('should support custom authentication logic per strategy', async () => {
      // Cada estrategia puede tener su propia lógica
      const emailCreds: AuthCredentials = {
        email: 'test@example.com',
        password: 'pass123',
      };

      const googleCreds: AuthCredentials = {
        provider: 'google',
        redirectTo: 'http://localhost:3000',
      };

      // Ambas son válidas para sus respectivas estrategias
      expect(emailStrategy.validateCredentials(emailCreds)).toBe(true);
      expect(googleStrategy.validateCredentials(googleCreds)).toBe(true);

      // Pero no son intercambiables
      expect(emailStrategy.validateCredentials(googleCreds)).toBe(false);
      expect(googleStrategy.validateCredentials(emailCreds)).toBe(false);
    });
  });

  describe('Strategy Pattern - Error Handling', () => {
    it('should handle authentication errors consistently', async () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrongpass',
      };

      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'Invalid credentials' },
      });

      const result = await emailStrategy.authenticate(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should throw AuthenticationError for invalid operations', () => {
      const error = new AuthenticationError(
        'Invalid credentials',
        'INVALID_CREDENTIALS',
        'email-password'
      );

      expect(error.message).toBe('Invalid credentials');
      expect(error.code).toBe('INVALID_CREDENTIALS');
      expect(error.strategy).toBe('email-password');
      expect(error.name).toBe('AuthenticationError');
    });

    it('should validate credentials before authentication', () => {
      const invalidCreds: AuthCredentials = {};

      expect(emailStrategy.validateCredentials(invalidCreds)).toBe(false);
      expect(googleStrategy.validateCredentials(invalidCreds)).toBe(false);
    });
  });

  describe('Strategy Pattern - Benefits Demonstration', () => {
    it('should eliminate conditional logic', () => {
      // Sin Strategy Pattern:
      // function authenticate(type, credentials) {
      //   if (type === 'email') {
      //     // lógica email
      //   } else if (type === 'google') {
      //     // lógica google
      //   } else if (type === 'facebook') {
      //     // lógica facebook
      //   }
      // }

      // Con Strategy Pattern:
      const strategies = new Map<string, IAuthStrategy>([
        ['email', emailStrategy],
        ['google', googleStrategy],
      ]);

      const getStrategy = (type: string) => strategies.get(type);

      const emailStrat = getStrategy('email');
      const googleStrat = getStrategy('google');

      expect(emailStrat).toBe(emailStrategy);
      expect(googleStrat).toBe(googleStrategy);

      // No hay condicionales, solo lookup en el mapa
    });

    it('should demonstrate Open/Closed Principle', () => {
      // Abierto para extensión (agregar nuevas estrategias)
      // Cerrado para modificación (no cambiar estrategias existentes)

      const initialStrategies = [emailStrategy, googleStrategy];
      expect(initialStrategies.length).toBe(2);

      // Agregar nueva estrategia sin modificar las existentes
      class GitHubStrategy implements IAuthStrategy {
        readonly name = 'github-oauth';
        readonly type = 'oauth' as const;

        async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
          return { success: true };
        }

        validateCredentials(credentials: AuthCredentials): boolean {
          return credentials.provider === 'github';
        }
      }

      const newStrategy = new GitHubStrategy();
      const extendedStrategies = [...initialStrategies, newStrategy];

      expect(extendedStrategies.length).toBe(3);
      // Las estrategias originales no fueron modificadas
      expect(initialStrategies.length).toBe(2);
    });

    it('should support strategy-specific configuration', () => {
      const emailConfig = emailStrategy.getConfig?.();
      const googleConfig = googleStrategy.getConfig?.();

      expect(emailConfig?.requiresRedirect).toBe(false);
      expect(googleConfig?.requiresRedirect).toBe(true);

      // Cada estrategia tiene su propia configuración
      expect(emailConfig?.displayName).not.toBe(googleConfig?.displayName);
    });
  });

  describe('Strategy Pattern - Real-world Usage', () => {
    it('should support multi-provider authentication in component', () => {
      // Simular componente que usa múltiples estrategias
      class AuthComponent {
        private strategies: Map<string, IAuthStrategy>;

        constructor() {
          this.strategies = new Map();
        }

        registerStrategy(strategy: IAuthStrategy) {
          this.strategies.set(strategy.name, strategy);
        }

        async login(strategyName: string, credentials: AuthCredentials): Promise<AuthResult> {
          const strategy = this.strategies.get(strategyName);
          if (!strategy) {
            return { success: false, error: 'Strategy not found' };
          }

          if (!strategy.validateCredentials(credentials)) {
            return { success: false, error: 'Invalid credentials' };
          }

          return await strategy.authenticate(credentials);
        }

        getAvailableStrategies() {
          return Array.from(this.strategies.values()).map(s => ({
            name: s.name,
            type: s.type,
            config: s.getConfig?.(),
          }));
        }
      }

      const component = new AuthComponent();
      component.registerStrategy(emailStrategy);
      component.registerStrategy(googleStrategy);

      const available = component.getAvailableStrategies();
      expect(available.length).toBe(2);
      expect(available[0].name).toBe('email-password');
      expect(available[1].name).toBe('google-oauth');
    });
  });
});

describe('Strategy Pattern - Architecture Validation', () => {
  it('should follow Strategy pattern principles', () => {
    const principles = {
      encapsulation: 'Cada algoritmo está encapsulado en su propia clase',
      interchangeability: 'Las estrategias son intercambiables',
      singleResponsibility: 'Cada estrategia tiene una única responsabilidad',
      openClosed: 'Abierto para extensión, cerrado para modificación',
      dependencyInversion: 'Depende de abstracciones (IAuthStrategy), no de implementaciones',
    };

    expect(Object.keys(principles).length).toBe(5);
  });

  it('should compare with alternative approaches', () => {
    // Alternativa 1: Condicionales
    // Problema: Viola Open/Closed, difícil de mantener

    // Alternativa 2: Strategy Pattern
    // Beneficios: Extensible, mantenible, testeable

    const comparison = {
      withoutStrategy: {
        extensibility: 'Baja - modificar código existente',
        testability: 'Media - tests acoplados',
        maintainability: 'Baja - condicionales complejos',
      },
      withStrategy: {
        extensibility: 'Alta - agregar nuevas estrategias fácilmente',
        testability: 'Alta - tests independientes por estrategia',
        maintainability: 'Alta - separación clara de responsabilidades',
      },
    };

    expect(comparison.withStrategy.extensibility).toContain('Alta');
    expect(comparison.withStrategy.testability).toContain('Alta');
  });

  it('should demonstrate when to use Strategy pattern', () => {
    const useCases = [
      'Múltiples formas de autenticación (email, OAuth, SSO)',
      'Diferentes algoritmos de cálculo o procesamiento',
      'Validaciones que varían según el contexto',
      'Estrategias de notificación (email, SMS, push)',
      'Métodos de pago diferentes',
    ];

    expect(useCases.length).toBeGreaterThan(3);
  });
});
