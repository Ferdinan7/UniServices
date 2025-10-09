// src/lib/ui/types.ts

/**
 * Interfaz base para las propiedades de un botón
 */
export interface ButtonProps {
	label: string;
	href?: string | null;
	target?: string | null;
	disabled?: boolean;
	className?: string;
	onClick?: () => void;
}

/**
 * Interfaz que representa un botón en el sistema
 * Cada implementación concreta debe tener un componente Svelte y sus props
 */
export interface IButton {
	component: any; // Componente Svelte
	props: ButtonProps;
}

/**
 * Interfaz Abstract Factory para crear familias de botones
 * Cada factory concreta implementará esta interfaz para crear botones
 * de una familia específica (tema, estilo, etc.)
 */
export interface IButtonFactory {
	createPrimaryButton(props?: Partial<ButtonProps>): IButton;
	createSecondaryButton(props?: Partial<ButtonProps>): IButton;
	createGhostButton(props?: Partial<ButtonProps>): IButton;
}

/**
 * Tipos de botones disponibles
 */
export type ButtonKind = 'primary' | 'secondary' | 'ghost';

/**
 * Temas disponibles para las factories
 */
export type ThemeType = 'modern' | 'classic' | 'minimal';
