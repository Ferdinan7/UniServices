// src/lib/ui/factories/MinimalButtonFactory.ts
import type { IButtonFactory, IButton, ButtonProps } from '../types';
import ButtonPrimary from '../buttonPrimary.svelte';
import ButtonSecondary from '../buttonSecondary.svelte';

/**
 * Factory concreta para crear botones con estilo minimalista
 * Utiliza esquema de colores simple con énfasis en tipografía y espacios
 */
export class MinimalButtonFactory implements IButtonFactory {
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
			className: 'bg-black text-white hover:bg-gray-800 rounded-none px-6 py-3 font-light tracking-wide',
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
			className: 'bg-white text-black hover:bg-gray-50 border border-black rounded-none px-6 py-3 font-light tracking-wide',
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
			className: 'bg-transparent text-black hover:text-gray-600 underline underline-offset-4 px-2 py-1 font-light',
			...props
		};

		return {
			component: ButtonSecondary,
			props: buttonProps
		};
	}
}
