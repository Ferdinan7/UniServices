<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import TramiteCard from '$lib/components/TramiteCard.svelte';
	import { getTramites } from '$lib/api/api';
	import { AUTH_CONFIG, buildAuthUrl, buildBackendUrl } from '$lib/config/auth';
	import { extractAccessTokenFromUrl, cleanUrlFromAuthParams } from '$lib/utils/tokenExtractor';
	import { UIFactoryProvider } from '$lib/ui';
	import type { IButtonFactory, IButton, ThemeType } from '$lib/ui';

	interface Tramite {
		title: string;
		description: string;
		link: string;
	}

	let tramitesGrouped: { category: string; tramites: Tramite[] }[] = [];
	let loading = true;
	let error: string | null = null;
	let accessToken: string | null = null;
	let isAuthenticated = false;

	// Configurar el provider de factories
	const factoryProvider = UIFactoryProvider.getInstance();

	// Temas disponibles para rotar entre categorías
	const themes: ThemeType[] = ['modern', 'classic', 'minimal'];

	/**
	 * Obtiene la factory correspondiente según el índice de la categoría
	 * Rota entre los 3 temas disponibles
	 */
	function getFactoryForCategory(categoryIndex: number): IButtonFactory {
		const themeIndex = categoryIndex % themes.length;
		const theme = themes[themeIndex];
		return factoryProvider.getButtonFactoryByTheme(theme);
	}

	/**
	 * Crea un botón para un trámite usando la factory de su categoría
	 */
	function createButtonForTramite(categoryIndex: number): IButton {
		const factory = getFactoryForCategory(categoryIndex);
		const button = factory.createPrimaryButton({
			label: 'Ir al trámite'
		});
		console.log(`🎨 Botón creado para categoría ${categoryIndex}:`, button);
		return button;
	}

	onMount(async () => {
		let tokenFromUrl: string | null = null;

		try {
			console.log('🔍 Iniciando verificación de autenticación...');

			// Extraer token de la URL (query params o fragmento)
			tokenFromUrl = extractAccessTokenFromUrl();
			console.log('📍 Token de URL:', tokenFromUrl ? 'Encontrado' : 'No encontrado');

			// Verificar si hay token en localStorage (de sesiones anteriores)
			const tokenFromStorage = localStorage.getItem('access_token');
			console.log('💾 Token en localStorage:', tokenFromStorage ? 'Encontrado' : 'No encontrado');

			// Usar el token de la URL o del localStorage
			accessToken = tokenFromUrl || tokenFromStorage;

			if (!accessToken) {
				console.log('❌ No hay token, redirigiendo a login...');
				// Sin token: mostrar loader por un tiempo antes de redirigir
				await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 segundo de delay
				const authServiceUrl = buildAuthUrl(AUTH_CONFIG.ENDPOINTS.LOGIN, window.location.origin);
				window.location.href = authServiceUrl;
				return;
			}

			console.log('✅ Token encontrado:', accessToken.substring(0, 20) + '...');

			// Guardar el token en localStorage si viene de la URL y limpiar la URL
			if (tokenFromUrl) {
				localStorage.setItem('access_token', tokenFromUrl);
				cleanUrlFromAuthParams();
				console.log('💾 Token guardado en localStorage');
			}

			// Verificar que el token tenga formato JWT básico
			if (!accessToken.includes('.') || accessToken.split('.').length !== 3) {
				console.error('❌ Token inválido (no tiene formato JWT)');
				localStorage.removeItem('access_token');
				const authServiceUrl = buildAuthUrl(AUTH_CONFIG.ENDPOINTS.LOGIN, window.location.origin);
				window.location.href = authServiceUrl;
				return;
			}

			console.log('✅ Token tiene formato JWT válido');
			isAuthenticated = true;

			// Cargar los trámites con el token de autenticación
			console.log('📥 Cargando trámites...');
			try {
				tramitesGrouped = await getTramites(accessToken);
				console.log('✅ Trámites cargados:', tramitesGrouped.length, 'grupos');
				console.log('📊 Datos de trámites:', tramitesGrouped);
			} catch (tramitesError) {
				console.error('❌ Error al cargar trámites:', tramitesError);
				error = `Error al cargar trámites: ${tramitesError instanceof Error ? tramitesError.message : String(tramitesError)}`;
				// Mantenemos isAuthenticated = true para mostrar la UI con el error
			}
		} catch (err) {
			console.error('❌ Error en onMount:', err);
			error = `Error de inicialización: ${err instanceof Error ? err.message : String(err)}`;
			// Si hay error de autenticación, marcar como no autenticado
			if (!accessToken) {
				isAuthenticated = false;
			}
		} finally {
			loading = false;
			console.log('🏁 Loading finalizado. isAuthenticated:', isAuthenticated, 'error:', error);
		}
	});

	function logout() {
		localStorage.removeItem('access_token');
		const authServiceUrl = buildAuthUrl(AUTH_CONFIG.ENDPOINTS.LOGOUT, window.location.origin);
		window.location.href = authServiceUrl;
	}
</script>

{#if !isAuthenticated}
	<!-- Pantalla de carga mientras se verifica la autenticación -->
	<div class="flex min-h-screen items-center justify-center bg-gray-100">
		<div class="max-w-md text-center">
			<div
				class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-green-600"
			></div>
			<p class="mb-4 text-gray-600">Verificando autenticación...</p>

			{#if error}
				<div class="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
					<h3 class="mb-2 font-semibold text-red-800">Error:</h3>
					<p class="text-sm text-red-700">{error}</p>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div class="flex min-h-screen bg-gray-100">
		<!-- Sidebar -->
		<aside class="w-64 bg-white p-6 shadow-lg">
			<h2 class="mb-6 text-2xl font-bold">Menú</h2>
			<nav class="space-y-4">
				<a href="/" class="block text-gray-700 hover:text-green-600">Trámites</a>
				<a href="/perfil" class="block text-gray-700 hover:text-green-600">Perfil</a>
				<a href="/notificaciones" class="block text-gray-700 hover:text-green-600">Notificaciones</a
				>
			</nav>
		</aside>

		<!-- Main content -->
		<div class="flex flex-1 flex-col">
			<!-- Topbar -->
			<header class="flex items-center justify-between bg-white p-4 shadow">
				<h1 class="text-xl font-semibold text-gray-800">Sistema de Trámites</h1>
				<div class="flex items-center gap-4">
					<span class="flex items-center gap-2 text-gray-700">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6 text-gray-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5.121 17.804A9 9 0 1119 12v1.5M15 21H9m6-4H9m12-4h-4a4 4 0 00-8 0H5a7 7 0 0114 0z"
							/>
						</svg>
						<span>Usuario Autenticado</span>
					</span>
					<button
						on:click={logout}
						class="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
					>
						Cerrar Sesión
					</button>
				</div>
			</header>

			<!-- Content -->
			<main class="flex-1 overflow-y-auto p-8">
				<h2 class="mb-8 text-3xl font-bold text-gray-800">Catálogo de Trámites</h2>

				{#if loading}
					<div class="flex items-center justify-center py-12">
						<div class="text-center">
							<div
								class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-green-600"
							></div>
							<p class="text-gray-500">Cargando trámites...</p>
						</div>
					</div>
				{:else if error}
					<div class="rounded-lg border border-red-200 bg-red-50 p-6">
						<h3 class="mb-2 text-lg font-semibold text-red-800">Error al cargar trámites</h3>
						<p class="mb-4 text-red-600">{error}</p>
						<div class="rounded bg-red-100 p-3 text-sm text-red-700">
							<p class="mb-2 font-semibold">Posibles causas:</p>
							<ul class="list-inside list-disc space-y-1">
								<li>El API Gateway no está corriendo (puerto 4000)</li>
								<li>El servicio de trámites no está corriendo (puerto 3550)</li>
								<li>Token de autenticación inválido</li>
							</ul>
							<p class="mt-3 font-semibold">Verifica que los servicios estén corriendo:</p>
							<code class="mt-1 block text-xs"
								>cd services/apigatewayUniversidad && npm run start:dev</code
							>
							<code class="mt-1 block text-xs">cd services/tramites-back && npm run start:dev</code>
						</div>
						<button
							on:click={() => window.location.reload()}
							class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
						>
							Reintentar
						</button>
					</div>
				{:else if tramitesGrouped.length === 0}
					<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
						<p class="text-yellow-800">No hay trámites disponibles.</p>
					</div>
				{:else}
					{#each tramitesGrouped as group, categoryIndex (categoryIndex)}
						<section class="mb-12">
							<h3
								class="mb-6 text-2xl font-semibold"
								class:text-green-600={categoryIndex % 3 === 0}
								class:text-blue-600={categoryIndex % 3 === 1}
								class:text-gray-800={categoryIndex % 3 === 2}
							>
								{group.category}
							</h3>
							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{#each group.tramites as tramite, tramiteIndex (categoryIndex + '-' + tramiteIndex)}
									<TramiteCard {...tramite} button={createButtonForTramite(categoryIndex)} />
								{/each}
							</div>
						</section>
					{/each}
				{/if}
			</main>
		</div>
	</div>
{/if}
