<!-- src/routes/demo/+page.svelte -->
<script lang="ts">
	import { UIFactoryProvider } from '$lib/ui';
	import type { ThemeType } from '$lib/ui';

	const provider = UIFactoryProvider.getInstance();

	// Simular las 3 categorías con sus respectivos temas
	const categories = [
		{
			name: 'Categoría 1 - Estilo Moderno',
			theme: 'modern' as ThemeType,
			color: 'text-green-600',
			description: 'Botones con estilo moderno (verde vibrante)'
		},
		{
			name: 'Categoría 2 - Estilo Clásico',
			theme: 'classic' as ThemeType,
			color: 'text-blue-600',
			description: 'Botones con estilo clásico (azul corporativo)'
		},
		{
			name: 'Categoría 3 - Estilo Minimalista',
			theme: 'minimal' as ThemeType,
			color: 'text-gray-800',
			description: 'Botones con estilo minimalista (blanco y negro)'
		}
	];

	// Crear botones para cada categoría
	const categoriesWithButtons = categories.map((category) => {
		const factory = provider.getButtonFactoryByTheme(category.theme);
		return {
			...category,
			primaryButton: factory.createPrimaryButton({ label: 'Ir al trámite' }),
			secondaryButton: factory.createSecondaryButton({ label: 'Más información' }),
			ghostButton: factory.createGhostButton({ label: 'Ver detalles' })
		};
	});
</script>

<div class="min-h-screen bg-gray-100 p-8">
	<div class="mx-auto max-w-6xl">
		<!-- Header -->
		<header class="mb-12 text-center">
			<h1 class="mb-4 text-4xl font-bold text-gray-800">
				Demostración de Patrones de Botones
			</h1>
			<p class="text-lg text-gray-600">
				Sistema de Abstract Factory aplicado por categoría de trámites
			</p>
			<a
				href="/"
				class="mt-4 inline-block rounded-lg bg-gray-800 px-6 py-2 text-white transition hover:bg-gray-700"
			>
				← Volver al Sistema
			</a>
		</header>

		<!-- Explicación del patrón -->
		<div class="mb-12 rounded-lg border-l-4 border-green-600 bg-white p-6 shadow-md">
			<h2 class="mb-3 text-xl font-semibold text-gray-800">🎨 ¿Cómo Funciona?</h2>
			<p class="mb-4 text-gray-700">
				Cada categoría de trámites utiliza una <strong>factory diferente</strong> del patrón
				Abstract Factory. Esto garantiza que todos los botones dentro de una misma categoría tengan
				un estilo consistente.
			</p>
			<ul class="list-inside list-disc space-y-2 text-gray-700">
				<li><strong>Categoría 1, 4, 7...</strong> → ModernButtonFactory (Verde)</li>
				<li><strong>Categoría 2, 5, 8...</strong> → ClassicButtonFactory (Azul)</li>
				<li><strong>Categoría 3, 6, 9...</strong> → MinimalButtonFactory (Minimalista)</li>
			</ul>
		</div>

		<!-- Demostración por categoría -->
		<div class="space-y-8">
			{#each categoriesWithButtons as category}
				<section class="rounded-xl bg-white p-8 shadow-md">
					<!-- Encabezado de categoría -->
					<div class="mb-6 border-b border-gray-200 pb-4">
						<h3 class="mb-2 text-2xl font-bold {category.color}">
							{category.name}
						</h3>
						<p class="text-sm text-gray-600">{category.description}</p>
					</div>

					<!-- Grid de ejemplos -->
					<div class="grid gap-8 md:grid-cols-3">
						<!-- Primary Button -->
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
							<h4 class="mb-4 text-center text-sm font-semibold uppercase text-gray-600">
								Primary Button
							</h4>
							<div class="flex flex-col items-center gap-4">
								<svelte:component
									this={category.primaryButton.component}
									{...category.primaryButton.props}
								/>
								<div class="text-center">
									<p class="text-xs text-gray-500">Acción principal</p>
								</div>
							</div>
						</div>

						<!-- Secondary Button -->
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
							<h4 class="mb-4 text-center text-sm font-semibold uppercase text-gray-600">
								Secondary Button
							</h4>
							<div class="flex flex-col items-center gap-4">
								<svelte:component
									this={category.secondaryButton.component}
									{...category.secondaryButton.props}
								/>
								<div class="text-center">
									<p class="text-xs text-gray-500">Acción secundaria</p>
								</div>
							</div>
						</div>

						<!-- Ghost Button -->
						<div class="rounded-lg border border-gray-200 bg-gray-50 p-6">
							<h4 class="mb-4 text-center text-sm font-semibold uppercase text-gray-600">
								Ghost Button
							</h4>
							<div class="flex flex-col items-center gap-4">
								<svelte:component
									this={category.ghostButton.component}
									{...category.ghostButton.props}
								/>
								<div class="text-center">
									<p class="text-xs text-gray-500">Acción terciaria</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Ejemplo de tarjeta de trámite simulada -->
					<div class="mt-8 border-t border-gray-200 pt-6">
						<h4 class="mb-4 text-sm font-semibold text-gray-700">
							Ejemplo: Tarjeta de Trámite con este Estilo
						</h4>
						<div class="rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
							<h5 class="mb-2 text-lg font-semibold text-gray-800">
								Ejemplo de Trámite Universitario
							</h5>
							<p class="mb-4 text-sm text-gray-600">
								Este es un ejemplo de cómo se vería una tarjeta de trámite usando el estilo de
								esta categoría. El botón mantiene la consistencia visual.
							</p>
							<svelte:component
								this={category.primaryButton.component}
								{...category.primaryButton.props}
							/>
						</div>
					</div>
				</section>
			{/each}
		</div>

		<!-- Código de ejemplo -->
		<div class="mt-12 rounded-lg bg-gray-900 p-6 text-white shadow-xl">
			<h3 class="mb-4 text-lg font-semibold">💻 Código de Implementación</h3>
			<pre class="overflow-x-auto text-sm"><code>{`// En +page.svelte
import { UIFactoryProvider } from '$lib/ui';

const provider = UIFactoryProvider.getInstance();

// Obtener factory según el índice de categoría
function getFactoryForCategory(categoryIndex: number) {
  const themes = ['modern', 'classic', 'minimal'];
  const themeIndex = categoryIndex % themes.length;
  const theme = themes[themeIndex];
  return provider.getButtonFactoryByTheme(theme);
}

// Crear botón para cada trámite
function createButtonForTramite(categoryIndex: number) {
  const factory = getFactoryForCategory(categoryIndex);
  return factory.createPrimaryButton({
    label: 'Ir al trámite'
  });
}

// En el template
{#each tramitesGrouped as group, categoryIndex}
  <section>
    <h3>{group.category}</h3>
    {#each group.tramites as tramite}
      <TramiteCard
        {...tramite}
        button={createButtonForTramite(categoryIndex, tramite.link)}
      />
    {/each}
  </section>
{/each}`}</code></pre>
		</div>

		<!-- Ventajas del patrón -->
		<div class="mt-8 grid gap-6 md:grid-cols-3">
			<div class="rounded-lg bg-green-50 p-6">
				<div class="mb-3 text-3xl">✅</div>
				<h4 class="mb-2 font-semibold text-green-800">Consistencia</h4>
				<p class="text-sm text-green-700">
					Todos los botones de una categoría tienen el mismo estilo garantizado
				</p>
			</div>
			<div class="rounded-lg bg-blue-50 p-6">
				<div class="mb-3 text-3xl">🔄</div>
				<h4 class="mb-2 font-semibold text-blue-800">Flexibilidad</h4>
				<p class="text-sm text-blue-700">
					Fácil agregar nuevos estilos sin modificar código existente
				</p>
			</div>
			<div class="rounded-lg bg-purple-50 p-6">
				<div class="mb-3 text-3xl">🎯</div>
				<h4 class="mb-2 font-semibold text-purple-800">Escalabilidad</h4>
				<p class="text-sm text-purple-700">
					El sistema crece sin complejidad adicional en el código
				</p>
			</div>
		</div>
	</div>
</div>
