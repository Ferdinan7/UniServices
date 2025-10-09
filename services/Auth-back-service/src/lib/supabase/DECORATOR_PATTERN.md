# 🎨 Patrón Decorator - Logging de Supabase

## 📖 Descripción General

Este proyecto implementa el **patrón estructural Decorator** para agregar logging transparente a todas las operaciones de Supabase sin modificar el código existente.

## 🎯 Problema Resuelto

**Antes:** No había visibilidad de las operaciones de base de datos. Era difícil:
- Debuggear problemas
- Medir performance
- Auditar operaciones
- Entender el flujo de queries

**Ahora:** Todas las operaciones son loggeadas automáticamente:
- ✅ Logs de inicio: "🔍 Ejecutando SELECT en tabla [users]"
- ✅ Logs de éxito: "✅ SELECT completado en [users] (45ms) - 10 registros"
- ✅ Logs de error: "❌ Error en INSERT en tabla [users] - Duplicate key"
- ✅ Logs de auth: "🔐 Auth: SIGN_IN exitoso para u***@example.com"

## 🏗️ Arquitectura del Patrón

```
┌─────────────────────────────────────────────────────────────┐
│                    ISupabaseClient                           │
│                     (Interface)                              │
│  ─────────────────────────────────────────────────────────  │
│  + getClient(): SupabaseClient                              │
│  + select(table, columns): Promise<any>                     │
│  + insert(table, data): Promise<any>                        │
│  + update(table, data): Promise<any>                        │
│  + delete(table): Promise<any>                              │
│  + from(table): QueryBuilder                                │
│  + auth: { signUp, signIn, ... }                           │
└─────────────────────────────────────────────────────────────┘
                         △
                         │ implements
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │                    │                    │
┌───▼────────────┐  ┌───▼────────────────┐  ┌▼──────────────┐
│  Supabase      │  │  Supabase          │  │   Más         │
│  Client        │  │  Logging           │  │   Decorators  │
│  Wrapper       │  │  Decorator         │  │   (futuros)   │
│  (Base)        │  │  (Logging)         │  │               │
└────────────────┘  └────────────────────┘  └───────────────┘
       │                     │                       │
       │                     │ wraps                 │
       └─────────────────────┘                       │
                             │ can wrap              │
                             └───────────────────────┘

         Component            Decorator           More Decorators
          (Base)            (adds logging)     (caching, metrics)
```

## 📁 Estructura de Archivos

```
src/lib/
├── supabase/
│   ├── supabase.service.ts                    # Servicio principal (usa decorators)
│   └── decorators/
│       ├── supabase-client.interface.ts       # Interface ISupabaseClient
│       ├── supabase-client-wrapper.ts         # Wrapper básico (Component)
│       ├── supabase-logging.decorator.ts      # Decorator de logging
│       └── index.ts                           # Exportaciones
│
└── logger/
    ├── supabase-logger.service.ts             # Logger especializado
    └── index.ts                               # Exportaciones
```

## 🔄 Flujo de Ejecución

### Ejemplo: SELECT Query

```typescript
// 1. Código del usuario
const users = await supabaseService.from('users').select('*').eq('active', true);

// 2. Flujo interno:
SupabaseService.from('users')
    ↓
SupabaseLoggingDecorator.from('users')
    ↓ Log: "🔍 Ejecutando SELECT en tabla [users]"
    ↓
SupabaseClientWrapper.from('users')
    ↓
SupabaseClient.from('users')  [Cliente real de Supabase]
    ↓
Supabase API
    ↓
Resultado
    ↓ Log: "✅ SELECT completado en [users] (45ms) - 10 registros"
    ↓
Retorno al usuario
```

## 🎨 Componentes del Patrón

### 1. ISupabaseClient (Component Interface)

**Propósito:** Define el contrato que deben cumplir tanto el componente base como los decorators.

```typescript
export interface ISupabaseClient {
  getClient(): SupabaseClient;
  select(table: string, columns?: string): Promise<any>;
  insert(table: string, data: any | any[]): Promise<any>;
  update(table: string, data: any): Promise<any>;
  delete(table: string): Promise<any>;
  from(table: string): any;
  auth: { ... };
  rpc(functionName: string, params?: any): Promise<any>;
}
```

### 2. SupabaseClientWrapper (Concrete Component)

**Propósito:** Implementación básica que envuelve el cliente real de Supabase.

```typescript
export class SupabaseClientWrapper implements ISupabaseClient {
  constructor(protected readonly client: SupabaseClient) {}
  
  // Implementa todos los métodos delegando al cliente real
  async select(table: string, columns: string = '*'): Promise<any> {
    const { data, error } = await this.client.from(table).select(columns);
    if (error) throw error;
    return data;
  }
  
  // ... otros métodos
}
```

### 3. SupabaseLoggingDecorator (Concrete Decorator)

**Propósito:** Agrega logging a todas las operaciones sin modificar la funcionalidad original.

```typescript
export class SupabaseLoggingDecorator implements ISupabaseClient {
  constructor(
    private readonly wrappedClient: ISupabaseClient,
    private readonly logger: SupabaseLoggerService,
  ) {}
  
  async select(table: string, columns: string = '*'): Promise<any> {
    // Log de inicio
    this.logger.logQueryStart('SELECT', table);
    
    try {
      // Delegar al componente envuelto
      const result = await this.wrappedClient.select(table, columns);
      
      // Log de éxito
      this.logger.logQuerySuccess('SELECT', table, result);
      
      return result;
    } catch (error) {
      // Log de error
      this.logger.logQueryError('SELECT', table, error);
      throw error;
    }
  }
  
  // ... otros métodos
}
```

### 4. SupabaseLoggerService (Helper)

**Propósito:** Formatea y emite logs de forma consistente.

```typescript
@Injectable()
export class SupabaseLoggerService {
  private readonly logger = new Logger('SupabaseClient');
  
  logQueryStart(operation: string, table?: string): void {
    this.logger.log(`🔍 Ejecutando ${operation} en tabla [${table}]`);
  }
  
  logQuerySuccess(operation: string, table?: string, duration?: number): void {
    this.logger.log(`✅ ${operation} completado en [${table}] (${duration}ms)`);
  }
  
  logQueryError(operation: string, table?: string, error?: any): void {
    this.logger.error(`❌ Error en ${operation} en tabla [${table}]`);
    this.logger.error(`💥 Error: ${error.message}`);
  }
  
  // ... otros métodos de logging
}
```

### 5. SupabaseService (Client Code)

**Propósito:** Orquesta la creación de la cadena de decorators.

```typescript
@Injectable()
export class SupabaseService {
  private client: ISupabaseClient;
  
  constructor() {
    const realClient = createClient(url, key);
    const wrapper = new SupabaseClientWrapper(realClient);
    
    // Aplicar decorator de logging
    this.client = new SupabaseLoggingDecorator(wrapper, logger);
  }
  
  getClient(): SupabaseClient {
    return this.client.getClient();
  }
  
  from(table: string): any {
    return this.client.from(table);
  }
  
  get auth() {
    return this.client.auth;
  }
}
```

## 🚀 Uso en la Aplicación

### Ejemplo 1: Query Básica con Logging Automático

```typescript
@Injectable()
export class UserService {
  constructor(private readonly supabase: SupabaseService) {}
  
  async getUsers() {
    // Log automático:
    // 🔍 Ejecutando SELECT en tabla [users]
    // ✅ SELECT completado en [users] (45ms) - 10 registros
    
    const { data, error } = await this.supabase
      .from('users')
      .select('*');
    
    return data;
  }
}
```

### Ejemplo 2: Operaciones de Autenticación

```typescript
@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}
  
  async signIn(email: string, password: string) {
    // Log automático:
    // 🔐 Iniciando SIGN_IN
    // 🔐 Auth: SIGN_IN exitoso para u***@example.com
    
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return data;
  }
}
```

### Ejemplo 3: Query Compleja con Filtros

```typescript
async findActiveUsersByRole(role: string) {
  // Log automático incluye los filtros:
  // 🔍 Ejecutando SELECT en tabla [users]
  // 📝 Parámetros: { filters: [{ method: 'eq', args: ['active', true] }] }
  // ✅ SELECT completado en [users] (62ms) - 5 registros
  
  const { data, error } = await this.supabase
    .from('users')
    .select('id, email, role')
    .eq('active', true)
    .eq('role', role)
    .order('created_at', { ascending: false });
  
  return data;
}
```

### Ejemplo 4: Operación INSERT

```typescript
async createUser(userData: any) {
  // Log automático:
  // 🔍 Ejecutando INSERT en tabla [users]
  // 📝 Parámetros: { rowCount: 1 }
  // ✅ INSERT completado en [users] (78ms) - Registro: uuid-123
  
  const { data, error } = await this.supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  return data;
}
```

### Ejemplo 5: Manejo de Errores

```typescript
async updateUser(userId: string, updates: any) {
  try {
    // Si hay error, el log será:
    // 🔍 Ejecutando UPDATE en tabla [users]
    // ❌ Error en UPDATE en tabla [users] (23ms)
    // 💥 Error: Foreign key violation
    
    const { data, error } = await this.supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    // El error ya está loggeado automáticamente
    throw error;
  }
}
```

## ⚙️ Configuración

### Variables de Entorno

```bash
# Habilitar/deshabilitar logging (default: true)
SUPABASE_LOGGING_ENABLED=true

# Logs detallados (incluye parámetros y resultados)
SUPABASE_DETAILED_LOGS=true

# Loggear parámetros de queries (puede incluir datos sensibles)
SUPABASE_LOG_PARAMS=false
```

### Configuración en Código

```typescript
// Deshabilitar logging dinámicamente
supabaseService.setLoggingEnabled(false);

// Habilitar logging dinámicamente
supabaseService.setLoggingEnabled(true);

// Obtener el logger para logs personalizados
const logger = supabaseService.getLogger();
logger.info('Operación personalizada', { context: 'extra data' });
```

## 📊 Ejemplos de Logs

### Log de SELECT Exitoso

```
[Nest] 12345  - 12/20/2024, 3:45:23 PM   LOG [SupabaseClient] 🔍 Ejecutando SELECT en tabla [users]
[Nest] 12345  - 12/20/2024, 3:45:23 PM DEBUG [SupabaseClient] 📝 Parámetros: { columns: "id, email, role" }
[Nest] 12345  - 12/20/2024, 3:45:23 PM   LOG [SupabaseClient] ✅ SELECT completado en [users] (45ms)
[Nest] 12345  - 12/20/2024, 3:45:23 PM DEBUG [SupabaseClient] 📊 Resultado: 10 registro(s)
```

### Log de INSERT con Error

```
[Nest] 12345  - 12/20/2024, 3:46:15 PM   LOG [SupabaseClient] 🔍 Ejecutando INSERT en tabla [users]
[Nest] 12345  - 12/20/2024, 3:46:15 PM DEBUG [SupabaseClient] 📝 Parámetros: { rowCount: 1 }
[Nest] 12345  - 12/20/2024, 3:46:15 PM ERROR [SupabaseClient] ❌ Error en INSERT en tabla [users] (23ms)
[Nest] 12345  - 12/20/2024, 3:46:15 PM ERROR [SupabaseClient] 💥 Error: duplicate key value violates unique constraint "users_email_key"
```

### Log de Autenticación

```
[Nest] 12345  - 12/20/2024, 3:47:00 PM   LOG [SupabaseClient] 🔐 Iniciando SIGN_IN
[Nest] 12345  - 12/20/2024, 3:47:01 PM   LOG [SupabaseClient] 🔐 Auth: SIGN_IN exitoso para joh***@example.com
[Nest] 12345  - 12/20/2024, 3:47:01 PM DEBUG [SupabaseClient] Duración: 1234ms
```

## ✨ Ventajas del Patrón Decorator

### 1. ✅ No Modifica el Código Existente

```typescript
// Código original (sin cambios)
const users = await supabaseService.from('users').select('*');

// Pero ahora tiene logging automático
```

### 2. ✅ Fácil Activar/Desactivar

```typescript
// Producción: logging habilitado
SUPABASE_LOGGING_ENABLED=true

// Desarrollo: logging detallado
SUPABASE_DETAILED_LOGS=true

// Tests: logging deshabilitado
SUPABASE_LOGGING_ENABLED=false
```

### 3. ✅ Extensible

```typescript
// Agregar más decorators sin modificar código existente
const wrapper = new SupabaseClientWrapper(realClient);
const withLogging = new SupabaseLoggingDecorator(wrapper, logger);
const withCache = new SupabaseCachingDecorator(withLogging, cache);
const withMetrics = new SupabaseMetricsDecorator(withCache, metrics);

// Cadena de decorators:
// User Code → Metrics → Cache → Logging → Wrapper → Real Client
```

### 4. ✅ Mantiene la Interfaz Original

```typescript
// Mismo código, con o sin decorators
const client: ISupabaseClient = /* wrapper o decorator */;

// Funciona igual
await client.from('users').select('*');
```

### 5. ✅ Testeable

```typescript
// Mock fácil del logger
const mockLogger = {
  logQueryStart: jest.fn(),
  logQuerySuccess: jest.fn(),
  logQueryError: jest.fn(),
};

const decorator = new SupabaseLoggingDecorator(wrapper, mockLogger);

// Verificar que se llamó el logger
expect(mockLogger.logQueryStart).toHaveBeenCalledWith('SELECT', 'users');
```

## 🔧 Agregar Nuevos Decorators

### Ejemplo: Decorator de Caché

```typescript
export class SupabaseCachingDecorator implements ISupabaseClient {
  constructor(
    private readonly wrappedClient: ISupabaseClient,
    private readonly cache: CacheService,
  ) {}
  
  async select(table: string, columns: string = '*'): Promise<any> {
    const cacheKey = `${table}:${columns}`;
    
    // Verificar cache
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;
    
    // Si no está en cache, ejecutar query
    const result = await this.wrappedClient.select(table, columns);
    
    // Guardar en cache
    await this.cache.set(cacheKey, result, 60); // 60 segundos
    
    return result;
  }
  
  // ... otros métodos
}
```

### Ejemplo: Decorator de Métricas

```typescript
export class SupabaseMetricsDecorator implements ISupabaseClient {
  constructor(
    private readonly wrappedClient: ISupabaseClient,
    private readonly metrics: MetricsService,
  ) {}
  
  async select(table: string, columns: string = '*'): Promise<any> {
    const startTime = Date.now();
    
    try {
      const result = await this.wrappedClient.select(table, columns);
      const duration = Date.now() - startTime;
      
      // Registrar métrica de éxito
      this.metrics.recordQueryDuration('select', table, duration);
      this.metrics.incrementQueryCount('select', table);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Registrar métrica de error
      this.metrics.recordQueryDuration('select', table, duration);
      this.metrics.incrementErrorCount('select', table);
      
      throw error;
    }
  }
  
  // ... otros métodos
}
```

## 🎯 Casos de Uso

### 1. Debugging

```typescript
// Ver todas las queries que se ejecutan
// Identificar queries lentas
// Encontrar errores de SQL
```

### 2. Auditoría

```typescript
// Registrar quién hizo qué operación
// Cumplir con regulaciones de privacidad
// Tracking de cambios en la BD
```

### 3. Performance Monitoring

```typescript
// Medir tiempos de respuesta
// Identificar cuellos de botella
// Optimizar queries lentas
```

### 4. Error Tracking

```typescript
// Capturar todos los errores de BD
// Enviar a servicios de monitoring (Sentry, etc.)
// Alertas automáticas
```

## 📚 Principios SOLID Aplicados

### S - Single Responsibility Principle ✅
- `SupabaseClientWrapper`: Solo envuelve el cliente
- `SupabaseLoggingDecorator`: Solo agrega logging
- `SupabaseLoggerService`: Solo formatea logs

### O - Open/Closed Principle ✅
- Abierto para extensión: Agregar nuevos decorators
- Cerrado para modificación: No se modifica código existente

### L - Liskov Substitution Principle ✅
- Cualquier `ISupabaseClient` puede sustituir a otro
- El código funciona igual con o sin decorators

### I - Interface Segregation Principle ✅
- `ISupabaseClient`: Interfaz específica y cohesiva
- No hay métodos innecesarios

### D - Dependency Inversion Principle ✅
- Dependemos de `ISupabaseClient` (abstracción)
- No de implementaciones concretas

## 🧪 Testing

### Test del Decorator

```typescript
describe('SupabaseLoggingDecorator', () => {
  it('should log query start and success', async () => {
    const mockLogger = {
      logQueryStart: jest.fn(),
      logQuerySuccess: jest.fn(),
    };
    
    const mockWrapper = {
      select: jest.fn().mockResolvedValue([{ id: 1 }]),
    };
    
    const decorator = new SupabaseLoggingDecorator(
      mockWrapper as any,
      mockLogger as any,
    );
    
    await decorator.select('users', '*');
    
    expect(mockLogger.logQueryStart).toHaveBeenCalledWith('SELECT', 'users', expect.any(Object));
    expect(mockLogger.logQuerySuccess).toHaveBeenCalledWith('SELECT', 'users', expect.any(Number), expect.any(Array));
  });
  
  it('should log errors', async () => {
    const mockLogger = {
      logQueryStart: jest.fn(),
      logQueryError: jest.fn(),
    };
    
    const mockWrapper = {
      select: jest.fn().mockRejectedValue(new Error('DB Error')),
    };
    
    const decorator = new SupabaseLoggingDecorator(
      mockWrapper as any,
      mockLogger as any,
    );
    
    await expect(decorator.select('users', '*')).rejects.toThrow('DB Error');
    
    expect(mockLogger.logQueryError).toHaveBeenCalled();
  });
});
```

## 📖 Referencias

- [Design Patterns: Decorator](https://refactoring.guru/design-patterns/decorator)
- [Gang of Four - Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [NestJS Logging](https://docs.nestjs.com/techniques/logger)
- [Supabase Documentation](https://supabase.com/docs)

---

**Versión:** 1.0.0  
**Fecha:** Diciembre 2024  
**Patrón:** Decorator  
**Framework:** NestJS + Supabase  
**Autor:** Sistema UniServices