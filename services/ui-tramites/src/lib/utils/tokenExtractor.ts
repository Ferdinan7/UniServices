/**
 * Extrae el access_token de una URL, ya sea de query parameters o del fragmento (#)
 */
export function extractAccessTokenFromUrl(): string | null {
  // Buscar en query parameters primero
  const urlParams = new URLSearchParams(window.location.search);
  let token = urlParams.get('access_token');

  // Si no se encuentra en query params, buscar en el fragmento de URL
  if (!token) {
    const fragment = window.location.hash.substring(1); // Remover el #
    const fragmentParams = new URLSearchParams(fragment);
    token = fragmentParams.get('access_token');
  }

  return token;
}

/**
 * Limpia la URL removiendo el access_token y otros parámetros de autenticación
 */
export function cleanUrlFromAuthParams(): void {
  const newUrl = new URL(window.location.href);

  // Limpiar query parameters de autenticación
  newUrl.searchParams.delete('access_token');
  newUrl.searchParams.delete('expires_at');
  newUrl.searchParams.delete('expires_in');
  newUrl.searchParams.delete('provider_refresh_token');
  newUrl.searchParams.delete('provider_token');
  newUrl.searchParams.delete('refresh_token');
  newUrl.searchParams.delete('token_type');

  // Limpiar todo el fragmento de URL
  newUrl.hash = '';

  // Actualizar la URL sin recargar la página
  window.history.replaceState({}, '', newUrl.toString());
}

/**
 * Verifica si hay parámetros de autenticación en la URL
 */
export function hasAuthParamsInUrl(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  const fragment = window.location.hash.substring(1);
  const fragmentParams = new URLSearchParams(fragment);

  return !!(
    urlParams.get('access_token') ||
    fragmentParams.get('access_token') ||
    urlParams.get('expires_at') ||
    fragmentParams.get('expires_at')
  );
}
