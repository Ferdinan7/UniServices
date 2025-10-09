# Abstract Factory Pattern - Sistema de UI

Este directorio implementa el patrón **Abstract Factory** para crear familias de componentes UI (botones) con diferentes estilos y temas.

## 📋 Tabla de Contenidos

- [¿Qué es Abstract Factory?](#qué-es-abstract-factory)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Componentes Principales](#componentes-principales)
- [Uso Básico](#uso-básico)
- [Ejemplos Avanzados](#ejemplos-avanzados)
- [Crear Nuevos Temas](#crear-nuevos-temas)
- [Mejores Prácticas](#mejores-prácticas)

## 🎯 ¿Qué es Abstract Factory?

El patrón **Abstract Factory** es un patrón creacional que proporciona una interfaz para crear familias de objetos relacionados sin especificar sus clases concretas.

### Ventajas

✅ **Consistencia**: Garantiza que los componentes de una familia sean compatibles entre sí
✅ **Flexibilidad**: Cambiar entre familias completas es sencillo
✅ **Escalabilidad**: Agregar nuevas familias es fácil sin modificar el código existente
✅ **Desacoplamiento**: El código cliente no depende de implementaciones concretas
✅ **Open/Closed Principle**: Abierto para extensión, cerrado para modificación

### Cuándo Usarlo

- Cuando necesitas crear familias de productos relacionados (ej: botones de diferentes temas)
- Cuando quieres garantizar que los productos de una familia se usen juntos
- Cuando el sistema debe ser independiente de cómo se crean los productos

## 📁 Estructura del Proyecto

```
ui/
├── types.ts                      # Interfaces y tipos base
├── UIFactoryProvider.ts          # Singleton para acceder a las factories
├── index.ts                      # Exportaciones públicas
├── buttonPrimary.svelte          # Componente botón primario
├── buttonSecondary.svelte        # Componente botón secundario
├── factories/
│   ├── index.ts                  # Exporta todas las factories
│   ├── ModernButtonFactory.ts    # Factory para tema moderno
│   ├── ClassicButtonFactory.ts   # Factory para tema clásico
│   └── MinimalButtonFactory.ts   # Factory para tema minimalista
└── examples/
    └── ButtonFactoryExample.svelte  # Ejemplo completo de uso
```

## 🧩 Componentes Principales

### 1. Interfaces Base (`types.ts`)

Define los contratos que deben cumplir todas las implementaciones:

```typescript
// Propiedades que acepta cualquier botón
interface ButtonProps {
  label: string;
  href?: string | null;
  target?: string | null;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

// Interfaz que representa un botón
interface IButton {
  component: any;  // Componente Svelte
  props: ButtonProps;
}

// Abstract Factory para crear botones
interface IButtonFactory {
  createPrimaryButton(props?: Partial<ButtonProps>): IButton;
  createSecondaryButton(props?: Partial<ButtonProps>): IButton;
  createGhostButton(props?: Partial<ButtonProps>): IButton;
}
```

### 2. Factories Concretas

Cada factory implementa `IButtonFactory` y crea botones con estilos específicos:

#### ModernButtonFactory
- **Primary**: Verde (`bg-green-600`)
- **Secondary**: Gris (`bg-gray-200`)
- **Ghost**: Transparente con borde

#### ClassicButtonFactory
- **Primary**: Azul con sombra (`bg-blue-600`)
- **Secondary**: Blanco con borde azul
- **Ghost**: Transparente azul

#### MinimalButtonFactory
- **Primary**: Negro con tipografía ligera
- **Secondary**: Blanco con borde negro
- **Ghost**: Subrayado minimalista

### 3. UIFactoryProvider (Singleton)

Punto de acceso único para obtener factories. Gestiona el tema actual y proporciona las factories correspondientes.

```typescript
class UIFactoryProvider {
  static getInstance(): UIFactoryProvider
  setTheme(theme: ThemeType): void
  getTheme(): ThemeType
  getButtonFactory(): IButtonFactory
  getAvailableThemes(): ThemeType[]
}
```

## 🚀 Uso Básico

### Ejemplo 1: Uso Simple

```typescript
import { UIFactoryProvider } from '$lib/ui';

// 1. Obtener el provider (Singleton)
const provider = UIFactoryProvider.getInstance();

// 2. Establecer el tema
provider.setTheme('modern');

// 3. Obtener la factory
const factory = provider.getButtonFactory();

// 4. Crear un botón
const saveButton = factory.createPrimaryButton({
  label: 'Guardar'
});
```

### Ejemplo 2: En un Componente Svelte

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('classic');
  
  const factory = provider.getButtonFactory();
  
  const submitBtn = factory.createPrimaryButton({ label: 'Enviar' });
  const cancelBtn = factory.createSecondaryButton({ label: 'Cancelar' });
</script>

<form>
  <!-- Renderizar los botones -->
  <svelte:component this={submitBtn.component} {...submitBtn.props} />
  <svelte:component this={cancelBtn.component} {...cancelBtn.props} />
</form>
```

### Ejemplo 3: Cambiar Tema Dinámicamente

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  import type { ThemeType } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  let currentTheme: ThemeType = 'modern';
  
  // Función para cambiar tema
  function changeTheme(newTheme: ThemeType) {
    provider.setTheme(newTheme);
    currentTheme = newTheme;
    // Recrear botones con el nuevo tema
    recreateButtons();
  }
  
  function recreateButtons() {
    const factory = provider.getButtonFactory();
    // Crear botones según el tema actual
    button = factory.createPrimaryButton({ label: 'Acción' });
  }
  
  let button = provider.getButtonFactory().createPrimaryButton({ label: 'Acción' });
</script>

<select on:change={(e) => changeTheme(e.target.value)}>
  <option value="modern">Moderno</option>
  <option value="classic">Clásico</option>
  <option value="minimal">Minimalista</option>
</select>

<svelte:component this={button.component} {...button.props} />
```

## 🎨 Ejemplos Avanzados

### Ejemplo 4: Formulario Completo

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('modern');
  
  const factory = provider.getButtonFactory();
  
  // Crear todos los botones del formulario
  const buttons = {
    submit: factory.createPrimaryButton({ label: 'Guardar Cambios' }),
    cancel: factory.createSecondaryButton({ label: 'Cancelar' }),
    reset: factory.createGhostButton({ label: 'Restablecer' })
  };
  
  function handleSubmit() {
    console.log('Formulario enviado');
  }
</script>

<form on:submit|preventDefault={handleSubmit}>
  <!-- Campos del formulario -->
  <input type="text" placeholder="Nombre" />
  <input type="email" placeholder="Email" />
  
  <!-- Botones creados por la factory -->
  <div class="button-group">
    <svelte:component 
      this={buttons.submit.component} 
      {...buttons.submit.props}
      on:click={handleSubmit}
    />
    <svelte:component this={buttons.cancel.component} {...buttons.cancel.props} />
    <svelte:component this={buttons.reset.component} {...buttons.reset.props} />
  </div>
</form>
```

### Ejemplo 5: Store Reactivo para Tema Global

```typescript
// stores/themeStore.ts
import { writable } from 'svelte/store';
import { UIFactoryProvider } from '$lib/ui';
import type { ThemeType } from '$lib/ui';

const provider = UIFactoryProvider.getInstance();

function createThemeStore() {
  const { subscribe, set } = writable<ThemeType>('modern');
  
  return {
    subscribe,
    setTheme: (theme: ThemeType) => {
      provider.setTheme(theme);
      set(theme);
    },
    getFactory: () => provider.getButtonFactory()
  };
}

export const themeStore = createThemeStore();
```

```svelte
<!-- Uso del store -->
<script lang="ts">
  import { themeStore } from './stores/themeStore';
  
  $: factory = $themeStore, themeStore.getFactory();
  $: primaryBtn = factory.createPrimaryButton({ label: 'Acción' });
</script>

<button on:click={() => themeStore.setTheme('classic')}>
  Cambiar a Clásico
</button>

<svelte:component this={primaryBtn.component} {...primaryBtn.props} />
```

## 🔧 Crear Nuevos Temas

Para agregar un nuevo tema, sigue estos pasos:

### Paso 1: Crear la Factory Concreta

```typescript
// factories/DarkButtonFactory.ts
import type { IButtonFactory, IButton, ButtonProps } from '../types';
import ButtonPrimary from '../buttonPrimary.svelte';
import ButtonSecondary from '../buttonSecondary.svelte';

export class DarkButtonFactory implements IButtonFactory {
  private readonly defaultProps: ButtonProps = {
    label: '',
    href: null,
    target: null,
    disabled: false,
    className: ''
  };

  createPrimaryButton(props?: Partial<ButtonProps>): IButton {
    const buttonProps: ButtonProps = {
      ...this.defaultProps,
      label: 'Aceptar',
      className: 'bg-purple-600 text-white hover:bg-purple-700',
      ...props
    };

    return {
      component: ButtonPrimary,
      props: buttonProps
    };
  }

  createSecondaryButton(props?: Partial<ButtonProps>): IButton {
    const buttonProps: ButtonProps = {
      ...this.defaultProps,
      label: 'Cancelar',
      className: 'bg-gray-800 text-white hover:bg-gray-700',
      ...props
    };

    return {
      component: ButtonSecondary,
      props: buttonProps
    };
  }

  createGhostButton(props?: Partial<ButtonProps>): IButton {
    const buttonProps: ButtonProps = {
      ...this.defaultProps,
      label: 'Acción',
      className: 'bg-transparent text-purple-400 hover:text-purple-300',
      ...props
    };

    return {
      component: ButtonSecondary,
      props: buttonProps
    };
  }
}
```

### Paso 2: Actualizar Tipos

```typescript
// types.ts
export type ThemeType = 'modern' | 'classic' | 'minimal' | 'dark';
```

### Paso 3: Registrar en UIFactoryProvider

```typescript
// UIFactoryProvider.ts
import { DarkButtonFactory } from './factories/DarkButtonFactory';

private constructor() {
  this.factories = new Map<ThemeType, IButtonFactory>();
  this.factories.set('modern', new ModernButtonFactory());
  this.factories.set('classic', new ClassicButtonFactory());
  this.factories.set('minimal', new MinimalButtonFactory());
  this.factories.set('dark', new DarkButtonFactory()); // ✨ Nuevo tema
}
```

### Paso 4: Exportar

```typescript
// factories/index.ts
export { DarkButtonFactory } from './DarkButtonFactory';

// index.ts
export { DarkButtonFactory } from './factories/DarkButtonFactory';
```

## ✨ Mejores Prácticas

### 1. Usa el Provider (No instancies factories directamente)

❌ **Incorrecto:**
```typescript
const factory = new ModernButtonFactory(); // No hagas esto
```

✅ **Correcto:**
```typescript
const provider = UIFactoryProvider.getInstance();
const factory = provider.getButtonFactory();
```

### 2. Establece el Tema al Inicio de la App

```typescript
// +layout.svelte o app initialization
import { UIFactoryProvider } from '$lib/ui';

const provider = UIFactoryProvider.getInstance();
provider.setTheme('modern'); // Establecer tema por defecto
```

### 3. No Mezcles Botones de Diferentes Familias

❌ **Incorrecto:**
```typescript
provider.setTheme('modern');
const btn1 = provider.getButtonFactory().createPrimaryButton();

provider.setTheme('classic');
const btn2 = provider.getButtonFactory().createSecondaryButton();
// btn1 y btn2 son de familias diferentes - no consistente
```

✅ **Correcto:**
```typescript
provider.setTheme('modern');
const factory = provider.getButtonFactory();
const btn1 = factory.createPrimaryButton();
const btn2 = factory.createSecondaryButton();
// Ambos botones de la misma familia - consistente
```

### 4. Usa Props Parciales para Personalización

```typescript
const factory = provider.getButtonFactory();

// Usa las props por defecto de la factory
const defaultBtn = factory.createPrimaryButton();

// Sobreescribe solo lo que necesitas
const customBtn = factory.createPrimaryButton({
  label: 'Guardar Ahora',
  disabled: true,
  className: 'extra-class' // Clases adicionales
});
```

### 5. Tipado Estricto

```typescript
import type { IButton, IButtonFactory, ThemeType } from '$lib/ui';

// Usa los tipos para mayor seguridad
let currentFactory: IButtonFactory;
let currentButton: IButton;
let theme: ThemeType = 'modern';
```

## 🧪 Testing

```typescript
// buttonFactory.test.ts
import { describe, it, expect } from 'vitest';
import { ModernButtonFactory } from '$lib/ui/factories';

describe('ModernButtonFactory', () => {
  it('should create primary button with default props', () => {
    const factory = new ModernButtonFactory();
    const button = factory.createPrimaryButton();
    
    expect(button.props.label).toBe('Aceptar');
    expect(button.props.disabled).toBe(false);
  });
  
  it('should override props', () => {
    const factory = new ModernButtonFactory();
    const button = factory.createPrimaryButton({
      label: 'Custom Label',
      disabled: true
    });
    
    expect(button.props.label).toBe('Custom Label');
    expect(button.props.disabled).toBe(true);
  });
});
```

## 📚 Recursos Adicionales

- [Design Patterns: Abstract Factory](https://refactoring.guru/design-patterns/abstract-factory)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [Svelte Component API](https://svelte.dev/docs#component-format)

## 🤝 Contribuir

Para agregar nuevos tipos de componentes (ej: inputs, modals):

1. Define la interfaz en `types.ts`
2. Crea las factories concretas
3. Actualiza `IButtonFactory` para incluir los nuevos métodos
4. Actualiza todas las factories existentes
5. Documenta el uso

---

**Autor**: Sistema UniServices  
**Versión**: 1.0.0  
**Fecha**: 2024