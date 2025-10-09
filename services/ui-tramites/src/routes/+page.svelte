<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import TramiteCard from '$lib/components/TramiteCard.svelte';
	import { getTramites } from '$lib/api/api';
	import { AUTH_CONFIG, buildAuthUrl, buildBackendUrl } from '$lib/config/auth';
	import { extractAccessTokenFromUrl, cleanUrlFromAuthParams } from '$lib/utils/tokenExtractor';

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

	onMount(async () => {
		let tokenFromUrl: string | null = null;

		try {
			// Extraer token de la URL (query params o fragmento)
			tokenFromUrl = extractAccessTokenFromUrl();

			// Verificar si hay token en localStorage (de sesiones anteriores)
			const tokenFromStorage = localStorage.getItem('access_token');

			// Usar el token de la URL o del localStorage
			accessToken = tokenFromUrl || tokenFromStorage;

			if (!accessToken) {
				// Sin token: mostrar loader por un tiempo antes de redirigir
				await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 segundos de delay
				const authServiceUrl = buildAuthUrl(AUTH_CONFIG.ENDPOINTS.LOGIN, window.location.origin);
				window.location.href = authServiceUrl;
				return;
			}

			// Guardar el token en localStorage si viene de la URL y limpiar la URL
			if (tokenFromUrl) {
				localStorage.setItem('access_token', tokenFromUrl);
				cleanUrlFromAuthParams();
			}

			// Verificar que el token sea válido
			const isValid = await verifyToken(accessToken);

			if (!isValid) {
				localStorage.removeItem('access_token');
				const authServiceUrl = buildAuthUrl(AUTH_CONFIG.ENDPOINTS.LOGIN, window.location.origin);
				window.location.href = authServiceUrl;
				return;
			}

			isAuthenticated = true;

			// Cargar los trámites con el token de autenticación
			tramitesGrouped = await getTramites(accessToken);
		} catch (err: unknown) {
			error = `Error de inicialización: ${err instanceof Error ? err.message : String(err)}`;
		} finally {
			loading = false;
		}
	});

	async function verifyToken(token: string): Promise<boolean> {
		try {
			// TEMPORAL: Simular verificación exitosa si el token tiene el formato JWT
			if (token && token.includes('.')) {
				return true;
			}

			// Verificar el token con el API Gateway usando REST
			const response = await fetch(buildBackendUrl(AUTH_CONFIG.ENDPOINTS.VERIFY_TOKEN), {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (response.ok) {
				await response.json();
				return true;
			} else {
				return false;
			}
		} catch {
			// Opcional: considerar inválido si hay error de conexión
			return false;
		}
	}

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
				<a href="#" class="block text-gray-700 hover:text-green-600">Trámites</a>
				<a href="#" class="block text-gray-700 hover:text-green-600">Perfil</a>
				<a href="#" class="block text-gray-700 hover:text-green-600">Notificaciones</a>
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
					<div class="rounded-lg border border-red-200 bg-red-50 p-4">
						<p class="text-red-600">{error}</p>
					</div>
				{:else}
					{#each tramitesGrouped as group (group.category)}
						<section class="mb-12">
							<h3 class="mb-6 text-2xl font-semibold text-green-600">{group.category}</h3>
							<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{#each group.tramites as tramite (tramite.link)}
									<TramiteCard {...tramite} />
								{/each}
							</div>
						</section>
					{/each}
				{/if}
			</main>
		</div>
	</div>
{/if}
