// src/lib/ui/uiFactory.ts
import ButtonPrimary from './buttonPrimary.svelte';
import ButtonSecondary from './buttonSecondary.svelte';

export type UIButtonKind = 'primary' | 'secondary' | 'ghost';

export type UIFactoryButton = {
	component: any; // componente Svelte para usar con <svelte:component>
	props: {
		label: string;
		href?: string;
		target?: string;
		disabled?: boolean;
		className?: string;
	};
};

/**
 * UIFactory: crea componentes UI agrupados por familia (aquí: botones).
 * - Centraliza props por defecto por variante.
 * - Permite overrides puntuales al crear el botón.
 */
export class UIFactory {
	private static defaults = {
		primary: { label: 'Aceptar', disabled: false, className: '' },
		secondary: { label: 'Cancelar', disabled: false, className: '' },
		ghost: { label: 'Acción', disabled: false, className: '' }
	};

	static createButton(
		kind: UIButtonKind,
		overrides?: Partial<UIFactoryButton['props']>
	): UIFactoryButton {
		let component: any;
		switch (kind) {
			case 'primary':
				component = ButtonPrimary;
				break;
			case 'secondary':
				component = ButtonSecondary;
				break;
			case 'ghost':
				component = ButtonSecondary; // Usar ButtonSecondary para ghost por ahora
				break;
			default:
				component = ButtonPrimary;
				break;
		}

		const defaultProps = UIFactory.defaults[kind];
		const props = { ...defaultProps, ...(overrides || {}) };
		return { component, props };
	}
}
