# 🚀 Guía de Inicio Rápido - Abstract Factory Pattern

Esta guía te ayudará a empezar a usar el sistema de UI con el patrón Abstract Factory en minutos.

## ⚡ Instalación Rápida

El sistema ya está instalado en tu proyecto. Solo necesitas importarlo:

```typescript
import { UIFactoryProvider } from '$lib/ui';
```

## 📝 Ejemplo Básico (3 pasos)

### Paso 1: Obtén el Provider

```typescript
import { UIFactoryProvider } from '$lib/ui';

const provider = UIFactoryProvider.getInstance();
```

### Paso 2: Selecciona un Tema

```typescript
provider.setTheme('modern'); // o 'classic', 'minimal'
```

### Paso 3: Crea Botones

```typescript
const factory = provider.getButtonFactory();
const button = factory.createPrimaryButton({ label: 'Guardar' });
```

### Paso 4: Usa en tu Template

```svelte
<svelte:component this={button.component} {...button.props} />
```

## 💡 Ejemplos Completos

### Ejemplo 1: Formulario Simple

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  // Setup
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('modern');
  const factory = provider.getButtonFactory();
  
  // Crear botones
  const saveBtn = factory.createPrimaryButton({ label: 'Guardar' });
  const cancelBtn = factory.createSecondaryButton({ label: 'Cancelar' });
  
  // Handlers
  function handleSave() {
    console.log('Guardando...');
  }
</script>

<form on:submit|preventDefault={handleSave}>
  <input type="text" placeholder="Nombre" />
  <input type="email" placeholder="Email" />
  
  <div class="flex gap-2">
    <svelte:component this={saveBtn.component} {...saveBtn.props} />
    <svelte:component this={cancelBtn.component} {...cancelBtn.props} />
  </div>
</form>
```

### Ejemplo 2: Botón con Link

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('classic');
  
  const factory = provider.getButtonFactory();
  const linkBtn = factory.createPrimaryButton({
    label: 'Ir al Dashboard',
    href: '/dashboard',
    target: '_self'
  });
</script>

<svelte:component this={linkBtn.component} {...linkBtn.props} />
```

### Ejemplo 3: Botón Deshabilitado

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  let isLoading = true;
  
  const provider = UIFactoryProvider.getInstance();
  const factory = provider.getButtonFactory();
  
  $: submitBtn = factory.createPrimaryButton({
    label: isLoading ? 'Cargando...' : 'Enviar',
    disabled: isLoading
  });
  
  setTimeout(() => isLoading = false, 2000);
</script>

<svelte:component this={submitBtn.component} {...submitBtn.props} />
```

### Ejemplo 4: Cambiar Tema Dinámicamente

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  import type { ThemeType } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  let currentTheme: ThemeType = 'modern';
  
  // Función reactiva para recrear botones
  $: factory = updateTheme(currentTheme);
  $: primaryBtn = factory.createPrimaryButton({ label: 'Acción Principal' });
  $: secondaryBtn = factory.createSecondaryButton({ label: 'Cancelar' });
  
  function updateTheme(theme: ThemeType) {
    provider.setTheme(theme);
    return provider.getButtonFactory();
  }
</script>

<div>
  <h3>Selector de Tema</h3>
  <select bind:value={currentTheme}>
    <option value="modern">Moderno</option>
    <option value="classic">Clásico</option>
    <option value="minimal">Minimalista</option>
  </select>
  
  <div class="mt-4 flex gap-2">
    <svelte:component this={primaryBtn.component} {...primaryBtn.props} />
    <svelte:component this={secondaryBtn.component} {...secondaryBtn.props} />
  </div>
</div>
```

### Ejemplo 5: Componente Reutilizable

```svelte
<!-- ButtonGroup.svelte -->
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  import type { ThemeType } from '$lib/ui';
  
  export let theme: ThemeType = 'modern';
  export let onSave: () => void = () => {};
  export let onCancel: () => void = () => {};
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme(theme);
  
  const factory = provider.getButtonFactory();
  const saveBtn = factory.createPrimaryButton({ label: 'Guardar' });
  const cancelBtn = factory.createSecondaryButton({ label: 'Cancelar' });
</script>

<div class="flex gap-2">
  <svelte:component 
    this={saveBtn.component} 
    {...saveBtn.props}
    on:click={onSave}
  />
  <svelte:component 
    this={cancelBtn.component} 
    {...cancelBtn.props}
    on:click={onCancel}
  />
</div>
```

```svelte
<!-- App.svelte (usando ButtonGroup) -->
<script lang="ts">
  import ButtonGroup from './ButtonGroup.svelte';
  
  function handleSave() {
    alert('Guardado!');
  }
  
  function handleCancel() {
    alert('Cancelado!');
  }
</script>

<ButtonGroup 
  theme="classic" 
  onSave={handleSave} 
  onCancel={handleCancel}
/>
```

### Ejemplo 6: Lista de Acciones

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('minimal');
  const factory = provider.getButtonFactory();
  
  const actions = [
    { id: 1, name: 'Editar', type: 'primary' as const },
    { id: 2, name: 'Duplicar', type: 'secondary' as const },
    { id: 3, name: 'Eliminar', type: 'ghost' as const }
  ];
  
  function createButton(type: 'primary' | 'secondary' | 'ghost', label: string) {
    switch(type) {
      case 'primary': return factory.createPrimaryButton({ label });
      case 'secondary': return factory.createSecondaryButton({ label });
      case 'ghost': return factory.createGhostButton({ label });
    }
  }
</script>

<div class="space-y-2">
  {#each actions as action}
    {@const button = createButton(action.type, action.name)}
    <svelte:component 
      this={button.component} 
      {...button.props}
      on:click={() => console.log(`Acción: ${action.name}`)}
    />
  {/each}
</div>
```

### Ejemplo 7: Modal con Botones

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  export let isOpen = false;
  export let onConfirm: () => void;
  export let onCancel: () => void;
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('classic');
  const factory = provider.getButtonFactory();
  
  const confirmBtn = factory.createPrimaryButton({ 
    label: 'Confirmar',
    className: 'w-full'
  });
  
  const cancelBtn = factory.createSecondaryButton({ 
    label: 'Cancelar',
    className: 'w-full'
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-xl max-w-md">
      <h2 class="text-xl font-bold mb-4">Confirmar Acción</h2>
      <p class="mb-6">¿Estás seguro de que deseas continuar?</p>
      
      <div class="space-y-2">
        <svelte:component 
          this={confirmBtn.component} 
          {...confirmBtn.props}
          on:click={onConfirm}
        />
        <svelte:component 
          this={cancelBtn.component} 
          {...cancelBtn.props}
          on:click={onCancel}
        />
      </div>
    </div>
  </div>
{/if}
```

### Ejemplo 8: Navegación con Botones

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('modern');
  const factory = provider.getButtonFactory();
  
  const navButtons = [
    factory.createPrimaryButton({ 
      label: 'Dashboard', 
      href: '/dashboard' 
    }),
    factory.createSecondaryButton({ 
      label: 'Perfil', 
      href: '/profile' 
    }),
    factory.createGhostButton({ 
      label: 'Configuración', 
      href: '/settings' 
    })
  ];
</script>

<nav class="flex gap-3 p-4">
  {#each navButtons as button}
    <svelte:component this={button.component} {...button.props} />
  {/each}
</nav>
```

### Ejemplo 9: Tabla con Acciones por Fila

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('classic');
  const factory = provider.getButtonFactory();
  
  const users = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    { id: 2, name: 'María García', email: 'maria@example.com' },
    { id: 3, name: 'Pedro López', email: 'pedro@example.com' }
  ];
  
  function handleEdit(userId: number) {
    console.log(`Editando usuario ${userId}`);
  }
  
  function handleDelete(userId: number) {
    console.log(`Eliminando usuario ${userId}`);
  }
</script>

<table class="w-full">
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Email</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {#each users as user}
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td class="flex gap-2">
          {@const editBtn = factory.createPrimaryButton({ label: 'Editar' })}
          {@const deleteBtn = factory.createGhostButton({ label: 'Eliminar' })}
          
          <svelte:component 
            this={editBtn.component} 
            {...editBtn.props}
            on:click={() => handleEdit(user.id)}
          />
          <svelte:component 
            this={deleteBtn.component} 
            {...deleteBtn.props}
            on:click={() => handleDelete(user.id)}
          />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
```

### Ejemplo 10: Wizard/Stepper con Navegación

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  provider.setTheme('modern');
  const factory = provider.getButtonFactory();
  
  let currentStep = 1;
  const totalSteps = 3;
  
  $: isFirstStep = currentStep === 1;
  $: isLastStep = currentStep === totalSteps;
  
  $: nextBtn = factory.createPrimaryButton({ 
    label: isLastStep ? 'Finalizar' : 'Siguiente',
    disabled: false
  });
  
  $: prevBtn = factory.createSecondaryButton({ 
    label: 'Anterior',
    disabled: isFirstStep
  });
  
  function handleNext() {
    if (isLastStep) {
      console.log('Wizard completado!');
    } else {
      currentStep++;
    }
  }
  
  function handlePrevious() {
    if (currentStep > 1) currentStep--;
  }
</script>

<div class="wizard">
  <div class="mb-4">
    <h2>Paso {currentStep} de {totalSteps}</h2>
  </div>
  
  <div class="content mb-6">
    {#if currentStep === 1}
      <p>Contenido del paso 1</p>
    {:else if currentStep === 2}
      <p>Contenido del paso 2</p>
    {:else}
      <p>Contenido del paso 3</p>
    {/if}
  </div>
  
  <div class="flex justify-between">
    <svelte:component 
      this={prevBtn.component} 
      {...prevBtn.props}
      on:click={handlePrevious}
    />
    <svelte:component 
      this={nextBtn.component} 
      {...nextBtn.props}
      on:click={handleNext}
    />
  </div>
</div>
```

## 🎨 Temas Disponibles

### Modern (Por defecto)
- Primary: Verde vibrante
- Secondary: Gris neutro
- Ghost: Transparente con borde

### Classic
- Primary: Azul corporativo con sombra
- Secondary: Blanco con borde azul
- Ghost: Azul transparente

### Minimal
- Primary: Negro con tipografía ligera
- Secondary: Blanco con borde negro
- Ghost: Subrayado minimalista

## 🔧 Personalización

### Agregar Clases CSS Personalizadas

```typescript
const button = factory.createPrimaryButton({
  label: 'Custom',
  className: 'shadow-2xl hover:scale-105 transition-transform'
});
```

### Combinar con Eventos

```svelte
<script lang="ts">
  import { UIFactoryProvider } from '$lib/ui';
  
  const provider = UIFactoryProvider.getInstance();
  const factory = provider.getButtonFactory();
  const button = factory.createPrimaryButton({ label: 'Click me' });
  
  function handleClick() {
    alert('¡Botón clickeado!');
  }
</script>

<svelte:component 
  this={button.component} 
  {...button.props}
  on:click={handleClick}
/>
```

## 🐛 Solución de Problemas Comunes

### Problema: "Theme 'xxx' no está disponible"
**Solución:** Verifica que el tema existe. Temas válidos: `modern`, `classic`, `minimal`

```typescript
// ✅ Correcto
provider.setTheme('modern');

// ❌ Incorrecto
provider.setTheme('custom'); // Error!
```

### Problema: Los botones no se actualizan al cambiar de tema
**Solución:** Usa reactividad de Svelte

```svelte
<script lang="ts">
  let theme = 'modern';
  
  // ❌ Incorrecto - el botón no se actualiza
  const button = factory.createPrimaryButton({ label: 'Test' });
  
  // ✅ Correcto - usa $: para reactividad
  $: {
    provider.setTheme(theme);
    button = provider.getButtonFactory().createPrimaryButton({ label: 'Test' });
  }
</script>
```

### Problema: TypeError al renderizar el botón
**Solución:** Asegúrate de que el botón está definido antes de renderizar

```svelte
{#if button}
  <svelte:component this={button.component} {...button.props} />
{/if}
```

## 📚 Próximos Pasos

1. **Lee la documentación completa:** `README.md`
2. **Explora la arquitectura:** `ARCHITECTURE.md`
3. **Revisa los ejemplos:** `examples/ButtonFactoryExample.svelte`
4. **Ejecuta los tests:** `npm test`

## 💬 Ayuda

Si tienes problemas, revisa:
- Los logs de la consola para errores
- La documentación completa en `README.md`
- Los tests en `__tests__/buttonFactory.test.ts`

¡Feliz desarrollo! 🎉