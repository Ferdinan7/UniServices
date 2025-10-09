# Uso del Callback de Autenticación en Svelte

## 📋 Resumen

Cuando un usuario se autentica con Google OAuth, el componente `auth-widget` procesará el callback y redirigirá a tu aplicación Svelte (`http://localhost:5173`) con el **access token** incluido en la URL.

## 🔄 Flujo de Autenticación

1. Usuario hace clic en "Sign in with Google"
2. Se redirige a Google para autenticarse
3. Google redirige de vuelta al componente auth (con parámetros OAuth)
4. El componente procesa el callback y extrae el token
5. **Se redirige a `http://localhost:5173` con el token en los parámetros de la URL**

## 📥 Recibir el Token en Svelte

### Opción 1: Leer desde la URL (Recomendado)

En tu aplicación Svelte, puedes leer el token directamente de los parámetros de la URL:

```javascript
// +page.svelte o +layout.svelte
<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  
  let accessToken = '';
  let userId = '';
  let userEmail = '';
  
  onMount(() => {
    // Leer parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    
    accessToken = params.get('access_token') || '';
    userId = params.get('user_id') || '';
    userEmail = params.get('user_email') || '';
    
    if (accessToken) {
      console.log('✅ Token recibido:', accessToken);
      console.log('👤 Usuario:', { userId, userEmail });
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('user_id', userId);
      localStorage.setItem('user_email', userEmail);
      
      // Limpiar la URL (opcional)
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Aquí puedes hacer tu lógica de autenticación
      // Por ejemplo, guardar en una store, hacer una llamada a tu API, etc.
    }
  });
</script>

{#if accessToken}
  <p>¡Bienvenido! Token: {accessToken.substring(0, 20)}...</p>
{/if}
```

### Opción 2: Usar SvelteKit Hooks

Si estás usando SvelteKit, puedes interceptar la autenticación en `hooks.server.js`:

```javascript
// hooks.server.js
export async function handle({ event, resolve }) {
  const accessToken = event.url.searchParams.get('access_token');
  
  if (accessToken) {
    // Guardar en cookies
    event.cookies.set('auth_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 días
    });
  }
  
  return resolve(event);
}
```

### Opción 3: Leer desde localStorage

El componente también guarda el token en localStorage, así que puedes acceder a él directamente:

```javascript
<script>
  import { onMount } from 'svelte';
  
  let isAuthenticated = false;
  let userInfo = null;
  
  onMount(() => {
    const token = localStorage.getItem('auth_token');
    const provider = localStorage.getItem('auth_provider');
    const userInfoStr = localStorage.getItem('user_info');
    
    if (token && provider) {
      isAuthenticated = true;
      userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
      
      console.log('✅ Usuario autenticado con:', provider);
      console.log('👤 Info del usuario:', userInfo);
    }
  });
</script>

{#if isAuthenticated}
  <div>
    <h2>Bienvenido, {userInfo?.email || 'Usuario'}</h2>
    <button on:click={signOut}>Cerrar sesión</button>
  </div>
{/if}
```

## 🔐 Parámetros Disponibles en la URL

Cuando se redirige desde el auth widget, estos parámetros están disponibles:

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `access_token` | Token JWT de acceso | `eyJhbGciOiJIUzI1NiIs...` |
| `user_id` | ID del usuario en Supabase | `a1b2c3d4-e5f6-...` |
| `user_email` | Email del usuario | `usuario@example.com` |

## 📦 Datos en localStorage

El componente también guarda estos datos en localStorage:

| Key | Descripción |
|-----|-------------|
| `auth_token` | Token de acceso |
| `refresh_token` | Token de refresco |
| `user_info` | Objeto JSON con información del usuario |
| `auth_provider` | Proveedor usado ('google', 'email-password') |
| `session_expires_at` | Fecha de expiración de la sesión |

## 🚀 Ejemplo Completo: Store de Autenticación en Svelte

```javascript
// stores/auth.js
import { writable } from 'svelte/store';

function createAuthStore() {
  const { subscribe, set, update } = writable({
    isAuthenticated: false,
    user: null,
    token: null
  });

  return {
    subscribe,
    
    // Inicializar desde localStorage
    init: () => {
      const token = localStorage.getItem('auth_token');
      const userInfo = localStorage.getItem('user_info');
      
      if (token && userInfo) {
        set({
          isAuthenticated: true,
          user: JSON.parse(userInfo),
          token: token
        });
      }
    },
    
    // Establecer autenticación desde callback
    setFromCallback: () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('access_token');
      const userId = params.get('user_id');
      const userEmail = params.get('user_email');
      
      if (token) {
        const user = { id: userId, email: userEmail };
        
        set({
          isAuthenticated: true,
          user: user,
          token: token
        });
        
        // Guardar en localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_info', JSON.stringify(user));
        
        // Limpiar URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    },
    
    // Cerrar sesión
    signOut: () => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth_provider');
      
      set({
        isAuthenticated: false,
        user: null,
        token: null
      });
    }
  };
}

export const auth = createAuthStore();
```

Uso en componentes:

```javascript
// +layout.svelte
<script>
  import { onMount } from 'svelte';
  import { auth } from '$lib/stores/auth';
  
  onMount(() => {
    // Intentar cargar desde callback
    auth.setFromCallback();
    
    // O inicializar desde localStorage
    auth.init();
  });
</script>

{#if $auth.isAuthenticated}
  <p>Bienvenido, {$auth.user.email}</p>
  <button on:click={() => auth.signOut()}>Cerrar sesión</button>
{:else}
  <p>No autenticado</p>
{/if}
```

## 🔒 Validar el Token en tu Backend

Una vez que tengas el token, puedes validarlo en tu backend:

```javascript
// Ejemplo con Supabase
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://sirtkdkbqsklncyoallp.supabase.co',
  'tu_anon_key'
);

// Verificar el token
const { data: { user }, error } = await supabase.auth.getUser(accessToken);

if (error) {
  console.error('Token inválido:', error);
} else {
  console.log('Usuario válido:', user);
}
```

## ⚙️ Configuración

Por defecto, el componente redirige a `http://localhost:5173`. Si necesitas cambiar esto:

```html
<!-- Cambiar URL de redirección -->
<auth-widget redirect-after-login="https://tu-dominio.com"></auth-widget>
```

## 🐛 Troubleshooting

### El token no aparece en la URL
- Verifica que Google OAuth esté configurado correctamente en Supabase
- Revisa la consola del navegador para errores
- Asegúrate de que la URL de callback en Google Cloud Console incluya tu dominio

### El token está vacío o undefined
- Espera unos segundos después de la redirección (hay un timeout de 1.5s)
- Verifica que el callback se esté procesando correctamente en el componente auth

### No puedo acceder al token en Svelte
- Verifica que estás leyendo los parámetros de la URL correctamente
- Usa `console.log(window.location.search)` para ver los parámetros disponibles

## 📚 Referencias

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [SvelteKit Hooks](https://kit.svelte.dev/docs/hooks)
- [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)