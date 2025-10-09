# Arquitectura del Patrón Abstract Factory

Este documento describe la arquitectura del sistema de UI implementando el patrón Abstract Factory.

## 📐 Diagrama de Clases (UML)

```
┌─────────────────────────────────────────────────────────────────┐
│                         <<interface>>                            │
│                       IButtonFactory                             │
├─────────────────────────────────────────────────────────────────┤
│ + createPrimaryButton(props?: Partial<ButtonProps>): IButton    │
│ + createSecondaryButton(props?: Partial<ButtonProps>): IButton  │
│ + createGhostButton(props?: Partial<ButtonProps>): IButton      │
└─────────────────────────────────────────────────────────────────┘
                                △
                                │
                                │ implements
                ┌───────────────┼───────────────┐
                │               │               │
                │               │               │
┌───────────────▼──────┐ ┌─────▼─────────┐ ┌──▼──────────────┐
│ ModernButtonFactory  │ │ ClassicButton │ │ MinimalButton   │
│                      │ │   Factory     │ │   Factory       │
├──────────────────────┤ ├───────────────┤ ├─────────────────┤
│ - defaultProps       │ │ - defaultProps│ │ - defaultProps  │
├──────────────────────┤ ├───────────────┤ ├─────────────────┤
│ + createPrimaryBtn() │ │ + createPrim..│ │ + createPrim... │
│ + createSecondary()  │ │ + createSec...│ │ + createSec...  │
│ + createGhost()      │ │ + createGho...│ │ + createGho...  │
└──────────────────────┘ └───────────────┘ └─────────────────┘
         │                      │                   │
         │                      │                   │
         └──────────────┬───────┴───────────────────┘
                        │ creates
                        ▼
                ┌───────────────┐
                │   <<interface>>│
                │     IButton   │
                ├───────────────┤
                │ + component   │
                │ + props       │
                └───────────────┘
                        △
                        │
                        │ uses
                ┌───────┴────────┐
                │                │
        ┌───────▼──────┐  ┌─────▼────────┐
        │ ButtonPrimary│  │ ButtonSecond.│
        │   .svelte    │  │   .svelte    │
        └──────────────┘  └──────────────┘


┌─────────────────────────────────────────────────────────────┐
│                  UIFactoryProvider                           │
│                     (Singleton)                              │
├─────────────────────────────────────────────────────────────┤
│ - static instance: UIFactoryProvider                        │
│ - currentTheme: ThemeType                                   │
│ - factories: Map<ThemeType, IButtonFactory>                 │
├─────────────────────────────────────────────────────────────┤
│ + static getInstance(): UIFactoryProvider                   │
│ + setTheme(theme: ThemeType): void                          │
│ + getTheme(): ThemeType                                     │
│ + getButtonFactory(): IButtonFactory                        │
│ + getButtonFactoryByTheme(theme: ThemeType): IButtonFactory │
│ + registerFactory(theme: ThemeType, factory: ...): void     │
│ + getAvailableThemes(): ThemeType[]                         │
└─────────────────────────────────────────────────────────────┘
                        │
                        │ manages
                        ▼
                IButtonFactory instances
```

## 🔄 Flujo de Datos

```
┌──────────────┐
│   Cliente    │
│  (Código de  │
│  aplicación) │
└──────┬───────┘
       │
       │ 1. getInstance()
       ▼
┌──────────────────┐
│ UIFactoryProvider│
│   (Singleton)    │
└──────┬───────────┘
       │
       │ 2. setTheme('modern')
       ▼
┌──────────────────┐
│ Theme Registry   │
│ ┌──────────────┐ │
│ │ modern: MBF  │ │
│ │ classic: CBF │ │
│ │ minimal: MnBF│ │
│ └──────────────┘ │
└──────┬───────────┘
       │
       │ 3. getButtonFactory()
       ▼
┌──────────────────┐
│ ModernButton     │
│    Factory       │
└──────┬───────────┘
       │
       │ 4. createPrimaryButton({label: 'Save'})
       ▼
┌──────────────────┐
│    IButton       │
│ ┌──────────────┐ │
│ │ component:   │ │
│ │  ButtonPrim. │ │
│ │ props: {...} │ │
│ └──────────────┘ │
└──────┬───────────┘
       │
       │ 5. Render with svelte:component
       ▼
┌──────────────────┐
│  DOM (Rendered   │
│     Button)      │
└──────────────────┘
```

## 🏗️ Estructura de Carpetas

```
ui/
│
├── types.ts                          # Interfaces y tipos base
│   ├── ButtonProps
│   ├── IButton
│   ├── IButtonFactory (Abstract Factory)
│   ├── ButtonKind
│   └── ThemeType
│
├── UIFactoryProvider.ts              # Singleton + Factory Registry
│   └── Gestiona todas las factories concretas
│
├── buttonPrimary.svelte              # Componente Svelte (Product)
├── buttonSecondary.svelte            # Componente Svelte (Product)
│
├── factories/                        # Concrete Factories
│   ├── index.ts
│   ├── ModernButtonFactory.ts       # Factory concreta #1
│   ├── ClassicButtonFactory.ts      # Factory concreta #2
│   └── MinimalButtonFactory.ts      # Factory concreta #3
│
├── examples/
│   └── ButtonFactoryExample.svelte  # Ejemplo de uso
│
├── __tests__/
│   └── buttonFactory.test.ts        # Tests unitarios
│
├── index.ts                          # Public API
├── README.md                         # Documentación
└── ARCHITECTURE.md                   # Este archivo
```

## 🎯 Patrones Implementados

### 1. Abstract Factory (Principal)
- **IButtonFactory**: Interfaz abstracta
- **ModernButtonFactory, ClassicButtonFactory, MinimalButtonFactory**: Factories concretas
- **IButton**: Producto abstracto

### 2. Singleton
- **UIFactoryProvider**: Asegura una única instancia del proveedor

### 3. Factory Method (implícito)
- Cada método `createXButton()` es un Factory Method

## 🔑 Principios SOLID Aplicados

### S - Single Responsibility Principle
✅ Cada factory tiene una única responsabilidad: crear botones de un tema específico
✅ UIFactoryProvider solo gestiona las factories, no crea botones directamente

### O - Open/Closed Principle
✅ Abierto para extensión: puedes agregar nuevas factories sin modificar el código existente
✅ Cerrado para modificación: el código cliente no necesita cambiar al agregar nuevos temas

### L - Liskov Substitution Principle
✅ Cualquier IButtonFactory puede ser sustituida por otra sin romper el código cliente

### I - Interface Segregation Principle
✅ Interfaces pequeñas y específicas (IButton, IButtonFactory)
✅ No hay métodos innecesarios en las interfaces

### D - Dependency Inversion Principle
✅ El código cliente depende de abstracciones (IButtonFactory) no de concreciones
✅ Las factories concretas implementan interfaces, no heredan de clases concretas

## 📊 Comparación: Factory vs Abstract Factory

### Factory Method (Simple Factory)
```typescript
// Un solo método que decide qué crear
class ButtonFactory {
  createButton(type: 'primary' | 'secondary'): Button {
    if (type === 'primary') return new PrimaryButton();
    return new SecondaryButton();
  }
}
```

### Abstract Factory (Este proyecto)
```typescript
// Familia completa de métodos para crear productos relacionados
interface IButtonFactory {
  createPrimaryButton(): IButton;
  createSecondaryButton(): IButton;
  createGhostButton(): IButton;
}

// Diferentes factories crean familias consistentes
class ModernButtonFactory implements IButtonFactory { ... }
class ClassicButtonFactory implements IButtonFactory { ... }
```

## 🎨 Extensibilidad

### Agregar un Nuevo Tema
1. Crear nueva factory: `DarkButtonFactory.ts`
2. Implementar `IButtonFactory`
3. Registrar en `UIFactoryProvider`
4. Actualizar tipo `ThemeType`

```typescript
// 1. Crear factory
export class DarkButtonFactory implements IButtonFactory {
  createPrimaryButton(props?: Partial<ButtonProps>): IButton {
    return {
      component: ButtonPrimary,
      props: {
        label: 'Aceptar',
        className: 'bg-purple-900 text-white',
        ...props
      }
    };
  }
  // ... otros métodos
}

// 2. Actualizar tipo
export type ThemeType = 'modern' | 'classic' | 'minimal' | 'dark';

// 3. Registrar en constructor de UIFactoryProvider
this.factories.set('dark', new DarkButtonFactory());
```

### Agregar Nuevos Productos (ej: Inputs)
1. Crear interfaz `IInputFactory`
2. Agregar métodos a factories existentes
3. Mantener consistencia en familias

```typescript
interface IUIFactory extends IButtonFactory, IInputFactory {
  // Métodos para botones
  createPrimaryButton(): IButton;
  // Métodos para inputs
  createTextInput(): IInput;
  createPasswordInput(): IInput;
}
```

## 🧪 Testing Strategy

### Unit Tests
- Probar cada factory de forma aislada
- Verificar que implementan la interfaz correctamente
- Validar props por defecto y overrides

### Integration Tests
- Probar UIFactoryProvider con diferentes factories
- Verificar cambio de tema dinámico
- Validar consistencia de familias

### Visual Tests (Storybook/Playwright)
- Renderizar botones de cada tema
- Capturar snapshots visuales
- Detectar regresiones de estilo

## 📈 Métricas y Performance

### Inicialización
- Todas las factories se crean una sola vez (Singleton)
- Costo de memoria: ~1KB por factory
- Tiempo de inicialización: <1ms

### Creación de Botones
- Factory Method: O(1) - constante
- Sin reflexión ni eval()
- Memory allocation mínima

### Cambio de Tema
- O(1) - lookup en Map
- No se recrean factories
- Solo se cambia la referencia

## 🔐 Seguridad

### Type Safety
- TypeScript estricto en todas las interfaces
- No se usa `any` excepto para componentes Svelte
- Props validadas en tiempo de compilación

### Validación en Runtime
- UIFactoryProvider valida temas existentes
- Lanza errores descriptivos para temas inválidos

## 🚀 Performance Tips

1. **Reutiliza la factory**: No llames a `getButtonFactory()` en cada render
2. **Memoiza botones**: En Svelte, considera usar `$:` para crear botones solo cuando cambie el tema
3. **Carga diferida**: Si tienes muchos temas, considera lazy loading de factories

```typescript
// ✅ Bueno - Factory reutilizada
const factory = provider.getButtonFactory();
const btn1 = factory.createPrimaryButton();
const btn2 = factory.createSecondaryButton();

// ❌ Malo - Multiple llamadas innecesarias
const btn1 = provider.getButtonFactory().createPrimaryButton();
const btn2 = provider.getButtonFactory().createSecondaryButton();
```

## 📚 Referencias

- [Gang of Four - Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [Refactoring Guru - Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)
- [Martin Fowler - Patterns of Enterprise Application Architecture](https://martinfowler.com/books/eaa.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Última actualización**: 2024
**Versión**: 1.0.0
**Mantenido por**: Equipo UniServices