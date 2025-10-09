// src/lib/ui/UIFactoryProvider.ts
import type { IButtonFactory, ThemeType } from './types';
import { ModernButtonFactory } from './factories/ModernButtonFactory';
import { ClassicButtonFactory } from './factories/ClassicButtonFactory';
import { MinimalButtonFactory } from './factories/MinimalButtonFactory';

/**
 * UIFactoryProvider - Punto de acceso único para obtener factories de UI
 *
 * Esta clase implementa el patrón Singleton y actúa como proveedor
 * de diferentes factories concretas basadas en el tema seleccionado.
 *
 * Ejemplo de uso:
 * ```typescript
 * const provider = UIFactoryProvider.getInstance();
 * provider.setTheme('modern');
 * const factory = provider.getButtonFactory();
 * const primaryBtn = factory.createPrimaryButton({ label: 'Guardar' });
 * ```
 */
export class UIFactoryProvider {
	private static instance: UIFactoryProvider;
	private currentTheme: ThemeType = 'modern';
	private factories: Map<ThemeType, IButtonFactory>;

	private constructor() {
		// Inicializar todas las factories disponibles
		this.factories = new Map<ThemeType, IButtonFactory>();
		this.factories.set('modern', new ModernButtonFactory());
		this.factories.set('classic', new ClassicButtonFactory());
		this.factories.set('minimal', new MinimalButtonFactory());
	}

	/**
	 * Obtiene la instancia única del UIFactoryProvider (Singleton)
	 */
	public static getInstance(): UIFactoryProvider {
		if (!UIFactoryProvider.instance) {
			UIFactoryProvider.instance = new UIFactoryProvider();
		}
		return UIFactoryProvider.instance;
	}

	/**
	 * Establece el tema actual del sistema
	 * @param theme - Tipo de tema a establecer
	 */
	public setTheme(theme: ThemeType): void {
		if (!this.factories.has(theme)) {
			throw new Error(`Tema '${theme}' no está disponible`);
		}
		this.currentTheme = theme;
	}

	/**
	 * Obtiene el tema actual
	 */
	public getTheme(): ThemeType {
		return this.currentTheme;
	}

	/**
	 * Obtiene la factory de botones para el tema actual
	 */
	public getButtonFactory(): IButtonFactory {
		const factory = this.factories.get(this.currentTheme);
		if (!factory) {
			throw new Error(`Factory para tema '${this.currentTheme}' no encontrada`);
		}
		return factory;
	}

	/**
	 * Obtiene una factory específica por tema (útil para casos especiales)
	 * @param theme - Tema del cual obtener la factory
	 */
	public getButtonFactoryByTheme(theme: ThemeType): IButtonFactory {
		const factory = this.factories.get(theme);
		if (!factory) {
			throw new Error(`Factory para tema '${theme}' no encontrada`);
		}
		return factory;
	}

	/**
	 * Registra una nueva factory personalizada
	 * @param theme - Nombre del tema
	 * @param factory - Instancia de la factory
	 */
	public registerFactory(theme: ThemeType, factory: IButtonFactory): void {
		this.factories.set(theme, factory);
	}

	/**
	 * Obtiene todos los temas disponibles
	 */
	public getAvailableThemes(): ThemeType[] {
		return Array.from(this.factories.keys());
	}
}
