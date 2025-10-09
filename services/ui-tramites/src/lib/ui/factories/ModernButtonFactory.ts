// src/lib/ui/factories/ModernButtonFactory.ts
import type { IButtonFactory, IButton, ButtonProps } from '../types';
import ButtonPrimary from '../buttonPrimary.svelte';
import ButtonSecondary from '../buttonSecondary.svelte';

/**
 * Factory concreta para crear botones con estilo moderno
 * Utiliza esquema de colores verde para primario y gris para secundario
 */
export class ModernButtonFactory implements IButtonFactory {
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
			className: '', // Vacío para usar estilos por defecto del componente
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
			className: '', // Vacío para usar estilos por defecto del componente
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
			className: 'bg-transparent text-gray-600 hover:bg-gray-100 border border-gray-300',
			...props
		};

		return {
			component: ButtonSecondary,
			props: buttonProps
		};
	}
}
