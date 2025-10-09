<script lang="ts">
	import { UIFactoryProvider } from '../UIFactoryProvider';
	import type { ThemeType, IButton } from '../types';

	// Obtener la instancia del provider (Singleton)
	const provider = UIFactoryProvider.getInstance();

	// Estado reactivo para el tema actual
	let currentTheme: ThemeType = provider.getTheme();
	let themes = provider.getAvailableThemes();

	// Botones que se crearán dinámicamente
	let primaryButton: IButton;
	let secondaryButton: IButton;
	let ghostButton: IButton;

	// Función para crear los botones según el tema actual
	function createButtons() {
		const factory = provider.getButtonFactory();

		primaryButton = factory.createPrimaryButton({
			label: 'Guardar Cambios'
		});

		secondaryButton = factory.createSecondaryButton({
			label: 'Cancelar'
		});

		ghostButton = factory.createGhostButton({
			label: 'Ver Detalles'
		});
	}

	// Función para cambiar de tema
	function changeTheme(theme: ThemeType) {
		provider.setTheme(theme);
		currentTheme = theme;
		createButtons();
	}

	// Inicializar botones al montar el componente
	createButtons();
</script>

<div class="p-8 max-w-4xl mx-auto">
	<h1 class="text-3xl font-bold mb-6">Ejemplo: Abstract Factory Pattern para Botones</h1>

	<div class="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
		<h2 class="text-xl font-semibold mb-3">Selector de Tema</h2>
		<p class="text-gray-600 mb-4">
			Selecciona un tema para ver cómo la factory crea botones de diferentes familias
		</p>

		<div class="flex gap-3">
			{#each themes as theme}
				<button
					on:click={() => changeTheme(theme)}
					class={`px-4 py-2 rounded font-medium transition ${
						currentTheme === theme
							? 'bg-blue-600 text-white'
							: 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
					}`}
				>
					{theme.charAt(0).toUpperCase() + theme.slice(1)}
				</button>
			{/each}
		</div>
	</div>

	<div class="space-y-6">
		<div>
			<h2 class="text-xl font-semibold mb-4">Tema Actual: <span class="text-blue-600">{currentTheme}</span></h2>
		</div>

		<!-- Sección de botones Primary -->
		<div class="p-6 bg-gray-50 rounded-lg">
			<h3 class="text-lg font-semibold mb-3">Primary Button</h3>
			<p class="text-sm text-gray-600 mb-4">Botón principal para acciones importantes</p>
			{#if primaryButton}
				<svelte:component this={primaryButton.component} {...primaryButton.props} />
			{/if}
		</div>

		<!-- Sección de botones Secondary -->
		<div class="p-6 bg-gray-50 rounded-lg">
			<h3 class="text-lg font-semibold mb-3">Secondary Button</h3>
			<p class="text-sm text-gray-600 mb-4">Botón secundario para acciones alternativas</p>
			{#if secondaryButton}
				<svelte:component this={secondaryButton.component} {...secondaryButton.props} />
			{/if}
		</div>

		<!-- Sección de botones Ghost -->
		<div class="p-6 bg-gray-50 rounded-lg">
			<h3 class="text-lg font-semibold mb-3">Ghost Button</h3>
			<p class="text-sm text-gray-600 mb-4">Botón discreto para acciones terciarias</p>
			{#if ghostButton}
				<svelte:component this={ghostButton.component} {...ghostButton.props} />
			{/if}
		</div>

		<!-- Ejemplo combinado -->
		<div class="p-6 bg-gray-50 rounded-lg">
			<h3 class="text-lg font-semibold mb-3">Ejemplo de Formulario</h3>
			<p class="text-sm text-gray-600 mb-4">Todos los botones de la misma familia trabajando juntos</p>
			<div class="flex gap-3 flex-wrap">
				{#if primaryButton && secondaryButton && ghostButton}
					<svelte:component this={primaryButton.component} {...primaryButton.props} />
					<svelte:component this={secondaryButton.component} {...secondaryButton.props} />
					<svelte:component this={ghostButton.component} {...ghostButton.props} />
				{/if}
			</div>
		</div>
	</div>

	<!-- Código de ejemplo -->
	<div class="mt-8 p-6 bg-gray-900 text-white rounded-lg overflow-auto">
		<h3 class="text-lg font-semibold mb-3">Código de Ejemplo</h3>
		<pre class="text-sm"><code>{`import { UIFactoryProvider } from '$lib/ui';

// 1. Obtener la instancia del provider (Singleton)
const provider = UIFactoryProvider.getInstance();

// 2. Establecer el tema deseado
provider.setTheme('${currentTheme}');

// 3. Obtener la factory del tema actual
const factory = provider.getButtonFactory();

// 4. Crear botones usando la factory
const primaryBtn = factory.createPrimaryButton({
  label: 'Guardar Cambios'
});

const secondaryBtn = factory.createSecondaryButton({
  label: 'Cancelar'
});

const ghostBtn = factory.createGhostButton({
  label: 'Ver Detalles'
});

// 5. Usar los botones en el template
// <svelte:component this={primaryBtn.component} {...primaryBtn.props} />
`}</code></pre>
	</div>

	<!-- Explicación del patrón -->
	<div class="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
		<h3 class="text-lg font-semibold mb-3 text-green-800">🎯 Ventajas del Patrón Abstract Factory</h3>
		<ul class="list-disc list-inside space-y-2 text-gray-700">
			<li>
				<strong>Consistencia:</strong> Garantiza que todos los botones de una familia tengan un estilo coherente
			</li>
			<li>
				<strong>Flexibilidad:</strong> Cambiar de tema es tan simple como cambiar la factory
			</li>
			<li>
				<strong>Escalabilidad:</strong> Agregar nuevos temas es fácil, solo crea una nueva factory concreta
			</li>
			<li>
				<strong>Desacoplamiento:</strong> El código cliente no depende de clases concretas
			</li>
			<li>
				<strong>Open/Closed:</strong> Abierto para extensión (nuevos temas), cerrado para modificación
			</li>
		</ul>
	</div>
</div>
