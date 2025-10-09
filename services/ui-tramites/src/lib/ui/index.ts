// src/lib/ui/index.ts

// Exportar tipos e interfaces
export type { IButton, IButtonFactory, ButtonProps, ButtonKind, ThemeType } from './types';

// Exportar componentes Svelte
export { default as ButtonPrimary } from './buttonPrimary.svelte';
export { default as ButtonSecondary } from './buttonSecondary.svelte';

// Exportar factories concretas
export { ModernButtonFactory } from './factories/ModernButtonFactory';
export { ClassicButtonFactory } from './factories/ClassicButtonFactory';
export { MinimalButtonFactory } from './factories/MinimalButtonFactory';

// Exportar el proveedor principal (Singleton)
export { UIFactoryProvider } from './UIFactoryProvider';

// Exportar la factory antigua para retrocompatibilidad (si es necesario)
export { UIFactory } from './uiFactory';
