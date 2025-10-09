# 🎯 Patrón Strategy - Sistema de Autenticación

## 📖 Descripción General

Este proyecto implementa el **patrón de comportamiento Strategy** para gestionar diferentes estrategias de autenticación en el sistema UniAuth. El patrón permite cambiar dinámicamente entre diferentes métodos de autenticación (Email/Password, Google OAuth, etc.) sin modificar el código cliente.

## 🎯 Problema Resuelto

**Antes:** Código con múltiples condicionales mezclados en un solo componente.

```typescript
// ❌ ANTES - Sin patrón Strategy
if (loginType === 'email') {
  // Código para email/password
  const response = await fetch(backendUrl, { ... });
  // ... lógica específica de email
} else if (loginType === 'google') {
  // Código para Google OAuth
  const supabase = await import('@supabase/supabase-js');
  // ... lógica específica de Google
} else if (loginType === 'facebook') {
  // ... más condicionales
}

// Difícil de mantener, propenso a errores, viola Open/Closed
```

**Ahora:** Código limpio con estrategias intercambiables.

```typescript
// ✅ DESPUÉS - Con patrón Strategy
const authService = new AuthService();

// Autenticar con Email/Password
await authService.authenticateWithEmailPassword(email, password);

// Autenticar con Google
await authService.authenticateWithGoogle(redirectTo);

// El AuthService delega a la estrategia correcta automáticamente
```

## 🏗️ Arquitectura del Patrón

```
┌─────────────────────────────────────────────────────────────────┐
│                        IAuthStrategy                             │
│                    (Strategy Interface)                          │
│ ──────────────────────────────────────────────────────────────  │
│ + authenticate(credentials): Promise<AuthResult>                 │
│ + validateCredentials(credentials): boolean                      │
│ + handleCallback?(data): Promise<AuthResult>                     │
│ + getConfig?(): Config                                          │
└─────────────────────────────────────────────────────────────────┘
                         △
                         │ implements
            ┌────────────┴────────────┐
            │                         │
┌───────────▼──────────┐  ┌──────────▼───────────┐
│ EmailPasswordStrategy│  │ GoogleOAuthStrategy  │
│  (Concrete Strategy) │  │  (Concrete Strategy) │
│ ───────────────────  │  │ ──────────────────── │
│ + authenticate()     │  │ + authenticate()     │
│ + validateCreds()    │  │ + validateCreds()    │
│ + getConfig()        │  │ + handleCallback()   │
│                      │  │ + getConfig()        │
└──────────────────────┘  └──────────────────────┘
            │                         │
            └────────────┬────────────┘
                         │ used by
                         ▼
            ┌─────────────────────────┐
            │     AuthService         │
            │      (Context)          │
            │ ──────────────────────  │
            │ - strategy: IAuthStrategy│
            │ - strategies: Map<>     │
            │ + setStrategy(name)     │
            │ + authenticate(creds)   │
            │ + authenticateWithEmail()│
            │ + authenticateWithGoogle()│
            └────────────┬─────────────┘
                         │ used by
                         ▼
            ┌─────────────────────────┐
            │     AuthWidget          │
            │     (Client/UI)         │
            │ ──────────────────────  │
            │ + signIn()              │
            │ + signInWithGoogle()    │
            └─────────────────────────┘
```

## 📁 Estructura del Proyecto

```
src/
├── strategies/
│   ├── IAuthStrategy.ts                    # Strategy Interface
│   ├── EmailPasswordStrategy.ts            # Concrete Strategy #1
│   ├── GoogleOAuthStrategy.ts              # Concrete Strategy #2
│   └── index.ts                            # Exportaciones
│
├── services/
│   ├── AuthService.ts                      # Context
│   └── index.ts                            # Exportaciones
│
└── components/
    └── auth-ui/
        ├── auth-widget.tsx                 # Client (UI)
        └── component.css                   # Estilos

Documentación:
├── STRATEGY_PATTERN.md                     # Este archivo
└── README.md                               # Documentación general
```

## 🎨 Componentes del Patrón

### 1. Strategy Interface (IAuthStrategy)

**Propósito:** Define el contrato que todas las estrategias deben cumplir.

```typescript
export interface IAuthStrategy {
  readonly name: string;
  readonly type: 'local' | 'oauth' | 'social' | 'sso';
  
  authenticate(credentials: AuthCredentials): Promise<AuthResult>;
  validateCredentials(credentials: AuthCredentials): boolean;
  handleCallback?(callbackData: any): Promise<AuthResult>;
  getConfig?(): {
    displayName: string;
    icon?: string;
    buttonText?: string;
    requiresRedirect?: boolean;
  };
}
```

### 2. Concrete Strategy #1: EmailPasswordStrategy

**Propósito:** Implementa autenticación con email y contraseña.

```typescript
export class EmailPasswordStrategy implements IAuthStrategy {
  readonly name = 'email-password';
  readonly type = 'local';
  
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    // 1. Validar credenciales
    if (!this.validateCredentials(credentials)) {
      throw new AuthenticationError('Invalid credentials');
    }
    
    // 2. Llamar al backend GraphQL
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: JSON.stringify({
        query: `mutation { signInComplete(...) }`
      })
    });
    
    // 3. Procesar respuesta y guardar tokens
    const authData = await response.json();
    this.saveTokens(authData);
    
    // 4. Retornar resultado
    return {
      success: true,
      accessToken: authData.access_token,
      user: { ... }
    };
  }
  
  validateCredentials(credentials: AuthCredentials): boolean {
    return !!(credentials.email && credentials.password);
  }
}
```

### 3. Concrete Strategy #2: GoogleOAuthStrategy

**Propósito:** Implementa autenticación con Google OAuth.

```typescript
export class GoogleOAuthStrategy implements IAuthStrategy {
  readonly name = 'google-oauth';
  readonly type = 'oauth';
  
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    // 1. Inicializar cliente de Supabase
    const supabase = await this.initializeSupabase();
    
    // 2. Iniciar flujo OAuth (redirige a Google)
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: credentials.redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    // 3. Retornar (la autenticación real ocurre en el callback)
    return {
      success: true,
      redirectUrl: data?.url
    };
  }
  
  async handleCallback(callbackData?: any): Promise<AuthResult> {
    // 1. Obtener sesión después de la redirección de Google
    const { data: { session }, error } = await supabase.auth.getSession();
    
    // 2. Guardar tokens
    this.saveTokens(session);
    
    // 3. Retornar resultado
    return {
      success: true,
      accessToken: session.access_token,
      user: { ... }
    };
  }
}
```

### 4. Context: AuthService

**Propósito:** Mantiene una referencia a la estrategia actual y delega las operaciones.

```typescript
export class AuthService {
  private strategy: IAuthStrategy | null = null;
  private strategies: Map<string, IAuthStrategy> = new Map();
  
  constructor() {
    // Registrar estrategias disponibles
    this.registerStrategy(new EmailPasswordStrategy());
    this.registerStrategy(new GoogleOAuthStrategy());
  }
  
  setStrategy(strategyName: string): void {
    this.strategy = this.strategies.get(strategyName);
  }
  
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    if (!this.strategy) {
      throw new Error('No strategy selected');
    }
    
    // Delegar a la estrategia actual
    return this.strategy.authenticate(credentials);
  }
  
  // Shortcuts para facilitar el uso
  async authenticateWithEmailPassword(email: string, password: string) {
    this.setStrategy('email-password');
    return this.authenticate({ email, password });
  }
  
  async authenticateWithGoogle(redirectTo?: string) {
    this.setStrategy('google-oauth');
    return this.authenticate({ provider: 'google', redirectTo });
  }
}
```

### 5. Client: AuthWidget (Componente Stencil)

**Propósito:** Usa el AuthService sin conocer los detalles de cada estrategia.

```typescript
export class AuthWidget {
  private async signIn(e: Event) {
    // Usar estrategia de Email/Password
    const result = await authService.authenticateWithEmailPassword(
      this.email, 
      this.password
    );
    
    if (result.success) {
      this.message = 'Login successful!';
      window.location.href = '/dashboard';
    } else {
      this.error = result.error;
    }
  }
  
  private async signInWithGoogle() {
    // Usar estrategia de Google OAuth
    const result = await authService.authenticateWithGoogle(
      window.location.origin
    );
    
    // OAuth redirige automáticamente
  }
}
```

## 🔄 Flujo de Ejecución

### Flujo 1: Autenticación con Email/Password

```
Usuario ingresa email y password
    ↓
AuthWidget.signIn()
    ↓
authService.authenticateWithEmailPassword(email, password)
    ↓
authService.setStrategy('email-password')
    ↓
authService.authenticate({ email, password })
    ↓
EmailPasswordStrategy.authenticate()
    ↓
Validar credenciales localmente
    ↓
Llamar al backend GraphQL
    ↓
Procesar respuesta
    ↓
Guardar tokens en localStorage
    ↓
Retornar AuthResult { success: true, accessToken, user }
    ↓
AuthWidget recibe resultado
    ↓
Mostrar mensaje de éxito
    ↓
Redirigir al dashboard
```

### Flujo 2: Autenticación con Google OAuth

```
Usuario hace clic en "Sign in with Google"
    ↓
AuthWidget.signInWithGoogle()
    ↓
authService.authenticateWithGoogle(redirectTo)
    ↓
authService.setStrategy('google-oauth')
    ↓
authService.authenticate({ provider: 'google', redirectTo })
    ↓
GoogleOAuthStrategy.authenticate()
    ↓
Inicializar cliente de Supabase
    ↓
supabase.auth.signInWithOAuth({ provider: 'google' })
    ↓
Redirigir al usuario a Google (sale de la app)
    ↓
Usuario autoriza en Google
    ↓
Google redirige de vuelta a la app con tokens
    ↓
AuthWidget.componentDidLoad() detecta callback
    ↓
authService.handleOAuthCallback('google-oauth')
    ↓
GoogleOAuthStrategy.handleCallback()
    ↓
Obtener sesión de Supabase
    ↓
Guardar tokens en localStorage
    ↓
Retornar AuthResult { success: true, accessToken, user }
    ↓
Limpiar parámetros de URL
    ↓
Mostrar mensaje de éxito
    ↓
Redirigir al dashboard
```

## 🚀 Uso en la Aplicación

### Ejemplo 1: Autenticación Básica con Email

```typescript
import { authService } from './services/AuthService';

async function loginWithEmail() {
  const result = await authService.authenticateWithEmailPassword(
    'user@example.com',
    'password123'
  );
  
  if (result.success) {
    console.log('Login successful!', result.user);
    console.log('Access Token:', result.accessToken);
  } else {
    console.error('Login failed:', result.error);
  }
}
```

### Ejemplo 2: Autenticación con Google

```typescript
import { authService } from './services/AuthService';

async function loginWithGoogle() {
  const result = await authService.authenticateWithGoogle(
    'http://localhost:5173'
  );
  
  // OAuth redirige automáticamente
  // El callback se maneja en componentDidLoad()
}
```

### Ejemplo 3: Cambiar Estrategia Dinámicamente

```typescript
import { authService } from './services/AuthService';

// Cambiar a estrategia de email
authService.setStrategy('email-password');
await authService.authenticate({ email, password });

// Cambiar a estrategia de Google
authService.setStrategy('google-oauth');
await authService.authenticate({ provider: 'google' });
```

### Ejemplo 4: Manejar Callback de OAuth

```typescript
import { authService } from './services/AuthService';
import { GoogleOAuthStrategy } from './strategies/GoogleOAuthStrategy';

componentDidLoad() {
  // Detectar si estamos en un callback de OAuth
  if (GoogleOAuthStrategy.isOAuthCallback()) {
    this.handleOAuthCallback();
  }
}

async handleOAuthCallback() {
  const result = await authService.handleOAuthCallback('google-oauth');
  
  if (result.success) {
    // Limpiar parámetros de URL
    GoogleOAuthStrategy.cleanOAuthParams();
    
    // Redirigir al dashboard
    window.location.href = '/dashboard';
  }
}
```

### Ejemplo 5: Listar Estrategias Disponibles

```typescript
import { authService } from './services/AuthService';

// Obtener todas las estrategias
const strategies = authService.getAllStrategies();
console.log('Estrategias disponibles:', strategies.map(s => s.name));

// Obtener configuración de UI para cada estrategia
const configs = authService.getAllStrategyConfigs();
configs.forEach(({ name, config }) => {
  console.log(`${name}: ${config.displayName} - ${config.buttonText}`);
});
```

## ✨ Ventajas del Patrón Strategy

### 1. ✅ Open/Closed Principle

```typescript
// Agregar nueva estrategia sin modificar código existente

// Nueva estrategia para Facebook
export class FacebookOAuthStrategy implements IAuthStrategy {
  readonly name = 'facebook-oauth';
  readonly type = 'oauth';
  
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    // Implementación específica de Facebook
  }
}

// Registrar en AuthService (constructor)
this.registerStrategy(new FacebookOAuthStrategy());

// ✅ Código existente no se modifica
// ✅ Solo se agrega nueva funcionalidad
```

### 2. ✅ Single Responsibility

```typescript
// Cada estrategia tiene una sola responsabilidad

EmailPasswordStrategy    → Solo maneja autenticación con email/password
GoogleOAuthStrategy      → Solo maneja autenticación con Google OAuth
FacebookOAuthStrategy    → Solo maneja autenticación con Facebook
AuthService              → Solo coordina las estrategias
```

### 3. ✅ Fácil Testing

```typescript
// Mock de una estrategia para testing
class MockAuthStrategy implements IAuthStrategy {
  readonly name = 'mock';
  readonly type = 'local';
  
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    return {
      success: true,
      accessToken: 'mock-token',
      user: { id: '1', email: 'test@example.com' }
    };
  }
  
  validateCredentials(): boolean {
    return true;
  }
}

// Usar en tests
const authService = new AuthService();
authService.registerStrategy(new MockAuthStrategy());
authService.setStrategy('mock');

const result = await authService.authenticate({});
expect(result.success).toBe(true);
```

### 4. ✅ Cambio Dinámico de Estrategia

```typescript
// Cambiar de estrategia en tiempo de ejecución

// Intentar con Google primero
authService.setStrategy('google-oauth');
let result = await authService.authenticate({ provider: 'google' });

// Si falla, intentar con email/password
if (!result.success) {
  authService.setStrategy('email-password');
  result = await authService.authenticate({ email, password });
}
```

### 5. ✅ Código Cliente Desacoplado

```typescript
// El componente no conoce los detalles de implementación

// ❌ ANTES (acoplado)
if (provider === 'google') {
  const supabase = createClient(...);
  await supabase.auth.signInWithOAuth({ provider: 'google' });
} else if (provider === 'email') {
  const response = await fetch(backendUrl, ...);
}

// ✅ DESPUÉS (desacoplado)
await authService.authenticateWithGoogle();
// o
await authService.authenticateWithEmailPassword(email, password);
```

## 🔧 Agregar Nueva Estrategia

### Paso 1: Crear la Estrategia

```typescript
// strategies/GitHubOAuthStrategy.ts
import { IAuthStrategy, AuthCredentials, AuthResult } from './IAuthStrategy';

export class GitHubOAuthStrategy implements IAuthStrategy {
  readonly name = 'github-oauth';
  readonly type = 'oauth';
  
  async authenticate(credentials: AuthCredentials): Promise<AuthResult> {
    // 1. Inicializar cliente (Supabase, Firebase, etc.)
    const supabase = await this.initializeSupabase();
    
    // 2. Iniciar flujo OAuth con GitHub
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: credentials.redirectTo
      }
    });
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true, redirectUrl: data?.url };
  }
  
  validateCredentials(credentials: AuthCredentials): boolean {
    return !credentials.provider || credentials.provider === 'github';
  }
  
  async handleCallback(callbackData?: any): Promise<AuthResult> {
    // Procesar callback de GitHub
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return { success: false, error: 'Session error' };
    }
    
    this.saveTokens(session);
    
    return {
      success: true,
      accessToken: session.access_token,
      user: {
        id: session.user.id,
        email: session.user.email,
        provider: 'github'
      }
    };
  }
  
  getConfig() {
    return {
      displayName: 'GitHub',
      icon: 'github-icon.svg',
      buttonText: 'Sign in with GitHub',
      requiresRedirect: true
    };
  }
}
```

### Paso 2: Registrar en AuthService

```typescript
// services/AuthService.ts
import { GitHubOAuthStrategy } from '../strategies/GitHubOAuthStrategy';

constructor() {
  this.initializeStrategies();
}

private initializeStrategies(): void {
  this.registerStrategy(new EmailPasswordStrategy());
  this.registerStrategy(new GoogleOAuthStrategy());
  this.registerStrategy(new GitHubOAuthStrategy()); // ✨ Nueva estrategia
}
```

### Paso 3: Exportar

```typescript
// strategies/index.ts
export { GitHubOAuthStrategy } from './GitHubOAuthStrategy';
```

### Paso 4: Usar en el Componente

```typescript
// components/auth-ui/auth-widget.tsx
private async signInWithGitHub() {
  const result = await authService.authenticateWithGitHub(
    window.location.origin
  );
  // OAuth redirige automáticamente
}

// O agregar shortcut en AuthService
async authenticateWithGitHub(redirectTo?: string) {
  this.setStrategy('github-oauth');
  return this.authenticate({ provider: 'github', redirectTo });
}
```

## 📊 Comparación: Antes vs Después

| Aspecto | Sin Strategy | Con Strategy |
|---------|--------------|--------------|
| **Agregar nueva auth** | Modificar código existente | Crear nueva estrategia |
| **Mantenibilidad** | Baja (código mezclado) | Alta (cada estrategia aislada) |
| **Testing** | Difícil (código acoplado) | Fácil (estrategias independientes) |
| **Complejidad** | Alta (muchos if/else) | Baja (delegación simple) |
| **Extensibilidad** | Difícil | Muy fácil |
| **Reutilización** | Baja | Alta |
| **Código duplicado** | Alto | Mínimo |

## 🎓 Principios SOLID Aplicados

### S - Single Responsibility Principle ✅
- Cada estrategia tiene una sola responsabilidad
- EmailPasswordStrategy solo maneja email/password
- GoogleOAuthStrategy solo maneja Google OAuth

### O - Open/Closed Principle ✅
- Abierto para extensión: agregar nuevas estrategias
- Cerrado para modificación: no se modifica código existente

### L - Liskov Substitution Principle ✅
- Cualquier IAuthStrategy puede sustituir a otra
- El AuthService funciona igual con cualquier estrategia

### I - Interface Segregation Principle ✅
- IAuthStrategy define solo métodos necesarios
- Métodos opcionales (handleCallback, getConfig) no son obligatorios

### D - Dependency Inversion Principle ✅
- AuthService depende de IAuthStrategy (abstracción)
- No depende de estrategias concretas

## 🧪 Testing

### Test de Estrategia

```typescript
describe('EmailPasswordStrategy', () => {
  let strategy: EmailPasswordStrategy;
  
  beforeEach(() => {
    strategy = new EmailPasswordStrategy();
  });
  
  it('should validate credentials correctly', () => {
    expect(strategy.validateCredentials({
      email: 'test@example.com',
      password: '123456'
    })).toBe(true);
    
    expect(strategy.validateCredentials({
      email: '',
      password: '123456'
    })).toBe(false);
  });
  
  it('should authenticate successfully', async () => {
    const result = await strategy.authenticate({
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(result.success).toBe(true);
    expect(result.accessToken).toBeDefined();
    expect(result.user).toBeDefined();
  });
});
```

### Test de AuthService

```typescript
describe('AuthService', () => {
  let authService: AuthService;
  
  beforeEach(() => {
    authService = new AuthService();
  });
  
  it('should switch strategies correctly', async () => {
    authService.setStrategy('email-password');
    expect(authService.getStrategy()?.name).toBe('email-password');
    
    authService.setStrategy('google-oauth');
    expect(authService.getStrategy()?.name).toBe('google-oauth');
  });
  
  it('should authenticate with correct strategy', async () => {
    const result = await authService.authenticateWithEmailPassword(
      'test@example.com',
      'password123'
    );
    
    expect(result.success).toBe(true);
  });
});
```

## 📚 Recursos Adicionales

- [Design Patterns: Strategy](https://refactoring.guru/design-patterns/strategy)
- [Gang of Four - Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Stencil.js Documentation](https://stenciljs.com/)

## 🎉 Resumen

### ✅ Implementación Completada

```
✨ Patrón Strategy completamente implementado
✅ 2 estrategias concretas (Email/Password, Google OAuth)
✅ AuthService como Context
✅ Componente AuthWidget refactorizado
✅ Fácil agregar nuevas estrategias
✅ Código limpio y mantenible
✅ 100% compatible con código existente
✅ Testing facilitado
✅ Documentación completa
```

### 🚀 ¡Listo para Producción!

El patrón Strategy está completamente implementado y listo para:
- **Agregar nuevas estrategias** (Facebook, GitHub, etc.)
- **Testing unitario** de cada estrategia
- **Mantenimiento fácil** con código desacoplado
- **Extensión sin modificación** (Open/Closed)

---

**Versión:** 1.0.0  
**Fecha:** Diciembre 2024  
**Patrón:** Strategy (Comportamiento)  
**Framework:** Stencil.js + TypeScript  
**Autor:** Sistema UniServices  
**Estado:** ✅ Completado y Listo para Producción