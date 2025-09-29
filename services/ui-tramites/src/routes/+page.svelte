<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import TramiteCard from "$lib/components/TramiteCard.svelte";
  import { getTramites } from "$lib/api/api";
  import { AUTH_CONFIG, buildAuthUrl, buildBackendUrl } from "$lib/config/auth";
  import { extractAccessTokenFromUrl, cleanUrlFromAuthParams } from "$lib/utils/tokenExtractor";

  let tramitesGrouped: { category: string; tramites: any[] }[] = [];
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
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 segundos de delay
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
    } catch (err: any) {
      error = `Error de inicialización: ${err}`;
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await response.json();
        return true;
      } else {
        return false;
      }
    } catch (_) {
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
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="text-center max-w-md">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p class="text-gray-600 mb-4">Verificando autenticación...</p>

      {#if error}
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 text-left">
          <h3 class="font-semibold text-red-800 mb-2">Error:</h3>
          <p class="text-sm text-red-700">{error}</p>
        </div>
      {/if}
    </div>
  </div>
{:else}
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-white shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-6">Menú</h2>
      <nav class="space-y-4">
        <a href="#" class="block text-gray-700 hover:text-green-600">Trámites</a>
        <a href="#" class="block text-gray-700 hover:text-green-600">Perfil</a>
        <a href="#" class="block text-gray-700 hover:text-green-600">Notificaciones</a>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col">
      <!-- Topbar -->
      <header class="bg-white shadow p-4 flex justify-between items-center">
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
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 p-8 overflow-y-auto">
        <h2 class="text-3xl font-bold mb-8 text-gray-800">Catálogo de Trámites</h2>

        {#if loading}
          <div class="flex items-center justify-center py-12">
            <div class="text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p class="text-gray-500">Cargando trámites...</p>
            </div>
          </div>
        {:else if error}
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600">{error}</p>
          </div>
        {:else}
          {#each tramitesGrouped as group}
            <section class="mb-12">
              <h3 class="text-2xl font-semibold text-green-600 mb-6">{group.category}</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each group.tramites as tramite}
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
