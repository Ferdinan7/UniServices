// src/lib/ui/__tests__/buttonFactory.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ModernButtonFactory } from '../factories/ModernButtonFactory';
import { ClassicButtonFactory } from '../factories/ClassicButtonFactory';
import { MinimalButtonFactory } from '../factories/MinimalButtonFactory';
import { UIFactoryProvider } from '../UIFactoryProvider';
import type { IButtonFactory, IButton } from '../types';

describe('Button Factories - Abstract Factory Pattern', () => {
	describe('ModernButtonFactory', () => {
		let factory: IButtonFactory;

		beforeEach(() => {
			factory = new ModernButtonFactory();
		});

		it('should create primary button with default props', () => {
			const button = factory.createPrimaryButton();

			expect(button).toBeDefined();
			expect(button.component).toBeDefined();
			expect(button.props).toBeDefined();
			expect(button.props.label).toBe('Aceptar');
			expect(button.props.disabled).toBe(false);
		});

		it('should create secondary button with default props', () => {
			const button = factory.createSecondaryButton();

			expect(button).toBeDefined();
			expect(button.props.label).toBe('Cancelar');
			expect(button.props.disabled).toBe(false);
		});

		it('should create ghost button with default props', () => {
			const button = factory.createGhostButton();

			expect(button).toBeDefined();
			expect(button.props.label).toBe('Acción');
			expect(button.props.disabled).toBe(false);
		});

		it('should override button props', () => {
			const button = factory.createPrimaryButton({
				label: 'Custom Label',
				disabled: true,
				href: '/custom-path'
			});

			expect(button.props.label).toBe('Custom Label');
			expect(button.props.disabled).toBe(true);
			expect(button.props.href).toBe('/custom-path');
		});

		it('should maintain default props when not overridden', () => {
			const button = factory.createPrimaryButton({
				label: 'Save'
			});

			expect(button.props.label).toBe('Save');
			expect(button.props.disabled).toBe(false); // Default value
			expect(button.props.href).toBeNull();
		});
	});

	describe('ClassicButtonFactory', () => {
		let factory: IButtonFactory;

		beforeEach(() => {
			factory = new ClassicButtonFactory();
		});

		it('should create primary button with classic styling', () => {
			const button = factory.createPrimaryButton();

			expect(button.props.className).toContain('bg-blue-600');
			expect(button.props.className).toContain('shadow-md');
		});

		it('should create secondary button with classic styling', () => {
			const button = factory.createSecondaryButton();

			expect(button.props.className).toContain('bg-white');
			expect(button.props.className).toContain('border-2');
			expect(button.props.className).toContain('border-blue-600');
		});

		it('should create ghost button with classic styling', () => {
			const button = factory.createGhostButton();

			expect(button.props.className).toContain('bg-transparent');
			expect(button.props.className).toContain('text-blue-600');
		});

		it('should allow className override while maintaining base styles', () => {
			const button = factory.createPrimaryButton({
				className: 'extra-class'
			});

			// Should have the custom className
			expect(button.props.className).toBe('extra-class');
		});
	});

	describe('MinimalButtonFactory', () => {
		let factory: IButtonFactory;

		beforeEach(() => {
			factory = new MinimalButtonFactory();
		});

		it('should create primary button with minimal styling', () => {
			const button = factory.createPrimaryButton();

			expect(button.props.className).toContain('bg-black');
			expect(button.props.className).toContain('font-light');
			expect(button.props.className).toContain('rounded-none');
		});

		it('should create secondary button with minimal styling', () => {
			const button = factory.createSecondaryButton();

			expect(button.props.className).toContain('bg-white');
			expect(button.props.className).toContain('border-black');
			expect(button.props.className).toContain('rounded-none');
		});

		it('should create ghost button with minimal styling', () => {
			const button = factory.createGhostButton();

			expect(button.props.className).toContain('underline');
			expect(button.props.className).toContain('bg-transparent');
		});
	});

	describe('UIFactoryProvider - Singleton Pattern', () => {
		it('should return the same instance', () => {
			const instance1 = UIFactoryProvider.getInstance();
			const instance2 = UIFactoryProvider.getInstance();

			expect(instance1).toBe(instance2);
		});

		it('should start with default theme (modern)', () => {
			const provider = UIFactoryProvider.getInstance();
			const theme = provider.getTheme();

			expect(theme).toBe('modern');
		});

		it('should change theme', () => {
			const provider = UIFactoryProvider.getInstance();

			provider.setTheme('classic');
			expect(provider.getTheme()).toBe('classic');

			provider.setTheme('minimal');
			expect(provider.getTheme()).toBe('minimal');

			// Reset to default
			provider.setTheme('modern');
		});

		it('should throw error for invalid theme', () => {
			const provider = UIFactoryProvider.getInstance();

			expect(() => {
				// @ts-expect-error - Testing invalid theme
				provider.setTheme('invalid-theme');
			}).toThrow();
		});

		it('should return correct factory for modern theme', () => {
			const provider = UIFactoryProvider.getInstance();
			provider.setTheme('modern');

			const factory = provider.getButtonFactory();
			const button = factory.createPrimaryButton();

			expect(button).toBeDefined();
			expect(button.props).toBeDefined();
		});

		it('should return correct factory for classic theme', () => {
			const provider = UIFactoryProvider.getInstance();
			provider.setTheme('classic');

			const factory = provider.getButtonFactory();
			const button = factory.createPrimaryButton();

			// Classic theme uses blue colors
			expect(button.props.className).toContain('blue');
		});

		it('should return correct factory for minimal theme', () => {
			const provider = UIFactoryProvider.getInstance();
			provider.setTheme('minimal');

			const factory = provider.getButtonFactory();
			const button = factory.createPrimaryButton();

			// Minimal theme uses black colors and no rounded corners
			expect(button.props.className).toContain('black');
			expect(button.props.className).toContain('rounded-none');
		});

		it('should return available themes', () => {
			const provider = UIFactoryProvider.getInstance();
			const themes = provider.getAvailableThemes();

			expect(themes).toContain('modern');
			expect(themes).toContain('classic');
			expect(themes).toContain('minimal');
			expect(themes.length).toBeGreaterThanOrEqual(3);
		});

		it('should get factory by specific theme', () => {
			const provider = UIFactoryProvider.getInstance();

			const modernFactory = provider.getButtonFactoryByTheme('modern');
			const classicFactory = provider.getButtonFactoryByTheme('classic');

			expect(modernFactory).toBeDefined();
			expect(classicFactory).toBeDefined();
			expect(modernFactory).not.toBe(classicFactory);
		});

		it('should allow registering custom factories', () => {
			const provider = UIFactoryProvider.getInstance();

			// Create a custom factory
			class CustomFactory implements IButtonFactory {
				createPrimaryButton(): IButton {
					return {
						component: null,
						props: {
							label: 'Custom Primary',
							disabled: false,
							className: 'custom-class'
						}
					};
				}

				createSecondaryButton(): IButton {
					return {
						component: null,
						props: {
							label: 'Custom Secondary',
							disabled: false,
							className: 'custom-class'
						}
					};
				}

				createGhostButton(): IButton {
					return {
						component: null,
						props: {
							label: 'Custom Ghost',
							disabled: false,
							className: 'custom-class'
						}
					};
				}
			}

			// Register custom factory
			// @ts-expect-error - Adding custom theme for testing
			provider.registerFactory('custom', new CustomFactory());

			// @ts-expect-error - Using custom theme
			provider.setTheme('custom');
			const factory = provider.getButtonFactory();
			const button = factory.createPrimaryButton();

			expect(button.props.label).toBe('Custom Primary');
			expect(button.props.className).toBe('custom-class');

			// Reset to default theme
			provider.setTheme('modern');
		});
	});

	describe('Factory Consistency - Abstract Factory Pattern Validation', () => {
		it('should create consistent button families within same factory', () => {
			const factory = new ModernButtonFactory();

			const primary = factory.createPrimaryButton();
			const secondary = factory.createSecondaryButton();
			const ghost = factory.createGhostButton();

			// All buttons from same factory should be defined
			expect(primary).toBeDefined();
			expect(secondary).toBeDefined();
			expect(ghost).toBeDefined();

			// All should have proper structure
			expect(primary.component).toBeDefined();
			expect(secondary.component).toBeDefined();
			expect(ghost.component).toBeDefined();
		});

		it('should create different styles between different factories', () => {
			const modernFactory = new ModernButtonFactory();
			const classicFactory = new ClassicButtonFactory();
			const minimalFactory = new MinimalButtonFactory();

			const modernBtn = modernFactory.createPrimaryButton();
			const classicBtn = classicFactory.createPrimaryButton();
			const minimalBtn = minimalFactory.createPrimaryButton();

			// Each factory should produce different styling
			expect(modernBtn.props.className).not.toBe(classicBtn.props.className);
			expect(classicBtn.props.className).not.toBe(minimalBtn.props.className);
			expect(modernBtn.props.className).not.toBe(minimalBtn.props.className);
		});

		it('should maintain interface contract across all factories', () => {
			const factories: IButtonFactory[] = [
				new ModernButtonFactory(),
				new ClassicButtonFactory(),
				new MinimalButtonFactory()
			];

			factories.forEach((factory) => {
				// Each factory must implement all required methods
				expect(typeof factory.createPrimaryButton).toBe('function');
				expect(typeof factory.createSecondaryButton).toBe('function');
				expect(typeof factory.createGhostButton).toBe('function');

				// Each method must return valid IButton
				const primary = factory.createPrimaryButton();
				const secondary = factory.createSecondaryButton();
				const ghost = factory.createGhostButton();

				[primary, secondary, ghost].forEach((button) => {
					expect(button).toHaveProperty('component');
					expect(button).toHaveProperty('props');
					expect(button.props).toHaveProperty('label');
					expect(button.props).toHaveProperty('disabled');
					expect(button.props).toHaveProperty('className');
				});
			});
		});
	});

	describe('Button Props Validation', () => {
		it('should handle all button props correctly', () => {
			const factory = new ModernButtonFactory();

			const button = factory.createPrimaryButton({
				label: 'Test Button',
				href: '/test-link',
				target: '_blank',
				disabled: true,
				className: 'custom-class',
				onClick: () => console.log('clicked')
			});

			expect(button.props.label).toBe('Test Button');
			expect(button.props.href).toBe('/test-link');
			expect(button.props.target).toBe('_blank');
			expect(button.props.disabled).toBe(true);
			expect(button.props.className).toBe('custom-class');
			expect(typeof button.props.onClick).toBe('function');
		});

		it('should handle partial props override', () => {
			const factory = new ClassicButtonFactory();

			const button = factory.createSecondaryButton({
				label: 'Only Label Changed'
			});

			expect(button.props.label).toBe('Only Label Changed');
			expect(button.props.disabled).toBe(false); // Default maintained
			expect(button.props.href).toBeNull(); // Default maintained
		});

		it('should handle empty props override', () => {
			const factory = new MinimalButtonFactory();

			const button = factory.createGhostButton({});

			expect(button.props.label).toBe('Acción'); // Default
			expect(button.props.disabled).toBe(false); // Default
		});
	});
});
