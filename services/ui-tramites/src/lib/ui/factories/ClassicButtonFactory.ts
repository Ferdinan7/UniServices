// src/lib/ui/factories/ClassicButtonFactory.ts
import type { IButtonFactory, IButton, ButtonProps } from '../types';
import ButtonPrimary from '../buttonPrimary.svelte';
import ButtonSecondary from '../buttonSecondary.svelte';

/**
 * Factory concreta para crear botones con estilo clásico
 * Utiliza esquema de colores azul para primario y blanco/gris para secundario
 */
export class ClassicButtonFactory implements IButtonFactory {
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
			className: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md',
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
			className: 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-600 shadow-sm',
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
			className: 'bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700',
			...props
		};

		return {
			component: ButtonSecondary,
			props: buttonProps
		};
	}
}
