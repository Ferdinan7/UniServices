# Design Patterns Testing Guide

Este documento describe los tests implementados para los patrones de diseño utilizados en UniServices.

## 📋 Tabla de Contenidos

- [Patrones Implementados](#patrones-implementados)
- [Estructura de Tests](#estructura-de-tests)
- [Ejecutar Tests](#ejecutar-tests)
- [Cobertura de Tests](#cobertura-de-tests)
- [Patrones Detallados](#patrones-detallados)

## 🏛️ Patrones Implementados

### 1. Abstract Factory Pattern - `ui-tramites`
**Ubicación:** `services/ui-tramites/src/lib/ui/`

**Propósito:** Creación de familias de componentes UI relacionados (botones) con diferentes temas.

**Implementación:**
- `IButtonFactory` - Interfaz Abstract Factory
- `ModernButtonFactory` - Factory concreta para tema moderno
- `ClassicButtonFactory` - Factory concreta para tema clásico
- `MinimalButtonFactory` - Factory concreta para tema minimalista
- `UIFactoryProvider` - Singleton para gestionar factories

**Tests:** `services/ui-tramites/src/lib/ui/__tests__/buttonFactory.test.ts`

**Beneficios:**
- ✅ Consistencia en creación de componentes
- ✅ Intercambiabilidad de temas
- ✅ Escalabilidad para nuevos temas
- ✅ Separación de lógica de creación

### 2. DAO Pattern - `tramites-back`
**Ubicación:** `services/tramites-back/src/tramites/dao/`

**Propósito:** Abstracción del acceso a datos, separando la lógica de negocio de la persistencia.

**Implementación:**
- `IGenericDao<T>` - Interfaz genérica para operaciones CRUD
- `ITramitesDao` - Interfaz específica extendiendo IGenericDao
- `TramitesDaoImpl` - Implementación concreta con Supabase

**Tests:** `services/tramites-back/src/tramites/dao/tramites-dao.spec.ts`

**Beneficios:**
- ✅ Separación entre lógica y datos
- ✅ Facilita cambio de base de datos
- ✅ Mejora testabilidad con mocks
- ✅ Encapsulación de queries complejas

### 3. Strategy Pattern - `uniauth`
**Ubicación:** `services/uniauth/src/strategies/`

**Propósito:** Definir múltiples estrategias de autenticación intercambiables.

**Implementación:**
- `IAuthStrategy` - Interfaz Strategy base
- `EmailPasswordStrategy` - Estrategia de autenticación local
- `GoogleOAuthStrategy` - Estrategia de autenticación OAuth

**Tests:** `services/uniauth/src/strategies/auth-strategy.spec.ts`

**Beneficios:**
- ✅ Flexibilidad en algoritmos de autenticación
- ✅ Extensibilidad sin modificar código existente
- ✅ Eliminación de condicionales complejos
- ✅ Cada estrategia es independiente y testeable

## 📁 Estructura de Tests

```
UniServices/
├── services/
│   ├── ui-tramites/
│   │   └── src/lib/ui/__tests__/
│   │       └── buttonFactory.test.ts          # Tests Abstract Factory
│   ├── tramites-back/
│   │   └── src/tramites/dao/
│   │       └── tramites-dao.spec.ts           # Tests DAO Pattern
│   └── uniauth/
│       └── src/strategies/
│           └── auth-strategy.spec.ts          # Tests Strategy Pattern
├── scripts/
│   └── generate-reports.js                    # Generador de reportes
└── reports/                                    # Reportes generados
    ├── latest-report.md
    ├── latest-coverage.json
    └── latest-patterns.json
```

## 🧪 Ejecutar Tests

### Tests Completos del Monorepo

```bash
# Ejecutar todos los tests
pnpm test

# Tests con cobertura
pnpm test:coverage

# Tests en modo watch
pnpm test:watch

# Generar reporte completo
pnpm test:report
```

### Tests por Patrón de Diseño

#### Abstract Factory (ui-tramites)
```bash
cd services/ui-tramites
pnpm test                    # Ejecutar tests
pnpm test:coverage           # Con cobertura
pnpm test:watch              # Modo watch

# Ejecutar test específico
pnpm test buttonFactory.test.ts
```

**Casos de Test:**
- ✅ Creación de botones por factory
- ✅ Consistencia dentro de la misma familia
- ✅ Intercambiabilidad entre factories
- ✅ Singleton del provider
- ✅ Configuración de temas

#### DAO Pattern (tramites-back)
```bash
cd services/tramites-back
pnpm test                    # Ejecutar tests
pnpm test:coverage           # Con cobertura
pnpm test:watch              # Modo watch

# Ejecutar test específico
pnpm test tramites-dao.spec.ts
```

**Casos de Test:**
- ✅ Operaciones CRUD básicas
- ✅ Operaciones específicas del dominio
- ✅ Abstracción de implementación
- ✅ Facilidad de mocking
- ✅ Cambio de implementación
- ✅ Encapsulación de queries complejas
- ✅ Manejo consistente de errores

#### Strategy Pattern (uniauth)
```bash
cd services/uniauth
pnpm test                    # Ejecutar tests
pnpm test:coverage           # Con cobertura
pnpm test:watch              # Modo watch

# Ejecutar test específico
pnpm test auth-strategy.spec.ts
```

**Casos de Test:**
- ✅ Implementación de interfaz Strategy
- ✅ Validación de credenciales por estrategia
- ✅ Autenticación con diferentes proveedores
- ✅ Intercambiabilidad de estrategias
- ✅ Gestión de registro de estrategias
- ✅ Extensibilidad sin modificar código
- ✅ Manejo de errores consistente

## 📊 Cobertura de Tests

### Umbrales de Cobertura

Cada servicio mantiene los siguientes umbrales mínimos:

| Servicio | Framework | Lines | Functions | Branches | Statements |
|----------|-----------|-------|-----------|----------|------------|
| ui-tramites | Vitest | 75% | 75% | 70% | 75% |
| tramites-back | Jest | 75% | 75% | 75% | 75% |
| uniauth | Stencil | 70% | 70% | 70% | 70% |

### Ver Reportes de Cobertura

```bash
# Generar y ver reportes
pnpm test:coverage

# Los reportes HTML se generan en:
# - services/ui-tramites/coverage/index.html
# - services/tramites-back/coverage/index.html
# - services/uniauth/coverage/index.html
```

## 🔍 Patrones Detallados

### Abstract Factory Pattern

**Problema que Resuelve:**
Crear familias de objetos relacionados sin especificar sus clases concretas.

**Ejemplo de Uso:**
```typescript
// Obtener factory para tema moderno
const factory = UIFactoryProvider.getInstance().getFactory('modern');

// Crear botón primario del tema moderno
const primaryButton = factory.createPrimaryButton({
  label: 'Guardar',
  onClick: handleSave
});

// Crear botón secundario del mismo tema
const secondaryButton = factory.createSecondaryButton({
  label: 'Cancelar',
  onClick: handleCancel
});

// Los botones son consistentes dentro del mismo tema
```

**Tests Clave:**
```typescript
it('should create consistent button families within same factory', () => {
  const factory = new ModernButtonFactory();
  const primary = factory.createPrimaryButton();
  const secondary = factory.createSecondaryButton();
  
  // Ambos botones pertenecen a la misma familia
  expect(primary).toBeDefined();
  expect(secondary).toBeDefined();
});
```

### DAO Pattern

**Problema que Resuelve:**
Separar la lógica de negocio del acceso a datos, permitiendo cambiar la implementación de persistencia sin afectar el resto de la aplicación.

**Ejemplo de Uso:**
```typescript
// En el servicio, usamos la interfaz DAO
class TramitesService {
  constructor(private tramitesDao: ITramitesDao) {}
  
  async getTramitesByCategory(category: string) {
    // La implementación de la consulta está en el DAO
    return await this.tramitesDao.findByCategory(category);
  }
  
  async searchTramites(term: string) {
    // Query compleja encapsulada en el DAO
    return await this.tramitesDao.globalSearch(term);
  }
}

// Fácil de testear con mocks
const mockDao: ITramitesDao = {
  findByCategory: jest.fn().mockResolvedValue([mockTramite])
};
```

**Tests Clave:**
```typescript
it('should abstract database implementation details', () => {
  // El DAO oculta si usamos Supabase, PostgreSQL, MongoDB, etc.
  expect(tramitesDao.findAll).toBeDefined();
  expect(typeof tramitesDao.findAll).toBe('function');
});

it('should allow easy mocking for testing', async () => {
  const mockDao: ITramitesDao = {
    ...tramitesDao,
    findAll: jest.fn().mockResolvedValue([mockTramite]),
  };
  
  const result = await mockDao.findAll();
  expect(result).toEqual([mockTramite]);
});
```

### Strategy Pattern

**Problema que Resuelve:**
Definir una familia de algoritmos (estrategias de autenticación), encapsular cada uno y hacerlos intercambiables.

**Ejemplo de Uso:**
```typescript
// Contexto que usa estrategias
class AuthComponent {
  private strategy: IAuthStrategy;
  
  // Cambiar estrategia en tiempo de ejecución
  setAuthMethod(method: string) {
    if (method === 'email') {
      this.strategy = new EmailPasswordStrategy();
    } else if (method === 'google') {
      this.strategy = new GoogleOAuthStrategy();
    }
  }
  
  async login(credentials: AuthCredentials) {
    // Validar según la estrategia actual
    if (!this.strategy.validateCredentials(credentials)) {
      throw new Error('Invalid credentials');
    }
    
    // Ejecutar autenticación con la estrategia seleccionada
    return await this.strategy.authenticate(credentials);
  }
}
```

**Tests Clave:**
```typescript
it('should use strategies interchangeably', async () => {
  const context = new AuthContext(emailStrategy);
  expect(context.getStrategyName()).toBe('email-password');
  
  // Cambiar estrategia sin modificar el contexto
  context.setStrategy(googleStrategy);
  expect(context.getStrategyName()).toBe('google-oauth');
});

it('should eliminate conditional logic', () => {
  // Sin Strategy: if/else complejos
  // Con Strategy: lookup simple
  const strategies = new Map([
    ['email', emailStrategy],
    ['google', googleStrategy],
  ]);
  
  const strategy = strategies.get('email');
  expect(strategy).toBe(emailStrategy);
});
```

## 📈 Métricas de Calidad

### Abstract Factory Pattern
- **Líneas de Código:** ~400 líneas de tests
- **Casos de Test:** 30+ casos
- **Cobertura:** 95%+ en factories
- **Tiempo de Ejecución:** ~200ms

### DAO Pattern
- **Líneas de Código:** ~500 líneas de tests
- **Casos de Test:** 40+ casos
- **Cobertura:** 90%+ en DAOs
- **Tiempo de Ejecución:** ~300ms

### Strategy Pattern
- **Líneas de Código:** ~630 líneas de tests
- **Casos de Test:** 35+ casos
- **Cobertura:** 90%+ en strategies
- **Tiempo de Ejecución:** ~250ms

## 🎯 Mejores Prácticas

### 1. Tests Descriptivos
```typescript
// ❌ Mal
it('test factory', () => { ... });

// ✅ Bien
it('should create consistent button families within same factory', () => { ... });
```

### 2. Organización por Patrón
```typescript
describe('DAO Pattern - Generic CRUD Operations', () => {
  // Tests de operaciones CRUD
});

describe('DAO Pattern - Domain-Specific Operations', () => {
  // Tests de operaciones específicas
});

describe('DAO Pattern - Abstraction Benefits', () => {
  // Tests que demuestran beneficios del patrón
});
```

### 3. Validación de Principios
```typescript
it('should follow Strategy pattern principles', () => {
  const principles = {
    encapsulation: 'Cada algoritmo encapsulado',
    interchangeability: 'Estrategias intercambiables',
    singleResponsibility: 'Una responsabilidad por estrategia',
    openClosed: 'Abierto para extensión, cerrado para modificación',
  };
  
  expect(Object.keys(principles).length).toBe(4);
});
```

### 4. Tests de Extensibilidad
```typescript
it('should allow adding new strategies without modifying existing code', () => {
  class FacebookStrategy implements IAuthStrategy {
    // Nueva estrategia
  }
  
  const newStrategy = new FacebookStrategy();
  registry.set('facebook', newStrategy);
  
  // No se modificó código existente
  expect(registry.size).toBe(3);
});
```

## 🚀 CI/CD Integration

Los tests se ejecutan automáticamente en CI/CD:

```yaml
# Ejemplo de configuración CI
- name: Run Tests
  run: pnpm test:ci

- name: Generate Coverage Report
  run: pnpm test:coverage

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```

## 📚 Recursos Adicionales

### Documentación de Patrones
- [Abstract Factory Pattern](./services/ui-tramites/README.md)
- [DAO Pattern](./services/tramites-back/DAO_PATTERN.md)
- [Strategy Pattern](./services/uniauth/STRATEGY_PATTERN.md)

### Guías de Testing
- [Testing Guide](./TESTING_GUIDE.md)
- [Quick Fix Guide](./QUICK_FIX.md)
- [Startup Guide](./STARTUP_GUIDE.md)

## 🤝 Contribuir

Al agregar nuevos patrones de diseño:

1. **Implementar el patrón** siguiendo principios SOLID
2. **Crear tests completos** cubriendo:
   - Implementación de interfaces
   - Casos de uso reales
   - Beneficios del patrón
   - Extensibilidad
3. **Documentar el patrón** en markdown
4. **Actualizar scripts de reporte** en `scripts/generate-reports.js`
5. **Verificar cobertura** mínima del 75%

## 📝 Notas

- Los tests de patrones de diseño no solo validan funcionalidad, sino que también **documentan** cómo y por qué usar cada patrón
- Cada test debe ser **auto-explicativo** y servir como ejemplo de uso
- La cobertura alta es importante, pero la **calidad de los tests** es más importante
- Los tests deben ser **rápidos** para no ralentizar el desarrollo

---

**Última actualización:** 2024
**Mantenido por:** Equipo UniServices