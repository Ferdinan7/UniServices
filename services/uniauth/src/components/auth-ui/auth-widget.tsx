// src/components/auth-ui/auth-widget.tsx
import { Component, h, State, getAssetPath, Prop } from '@stencil/core';
import { authService } from '../../services/AuthService';
import { GoogleOAuthStrategy } from '../../strategies/GoogleOAuthStrategy';
import type { AuthResult } from '../../strategies/IAuthStrategy';

/**
 * Componente de autenticación que implementa el patrón Strategy
 *
 * Este componente usa AuthService que actúa como Context del patrón Strategy,
 * delegando las operaciones de autenticación a diferentes estrategias:
 * - EmailPasswordStrategy: Para autenticación con email y contraseña
 * - GoogleOAuthStrategy: Para autenticación con Google OAuth
 *
 * Patrón Strategy aplicado:
 * - Context: AuthService
 * - Strategies: EmailPasswordStrategy, GoogleOAuthStrategy
 * - Client: Este componente (auth-widget)
 *
 * El componente no necesita conocer los detalles de implementación de cada
 * estrategia, solo usa la interfaz común proporcionada por AuthService.
 */
@Component({
  tag: 'auth-widget',
  styleUrl: 'component.css',
  shadow: true,
  assetsDirs: ['assets'],
})
export class AuthWidget {
  @State() email: string = '';
  @State() password: string = '';
  @State() error: string = '';
  @State() message: string = '';
  @State() loading: boolean = false;

  @Prop() image: string = 'bike.png';
  @Prop() height: string = '600px';
  @Prop() redirectAfterLogin: string = 'http://localhost:5173';

  /**
   * Maneja el login con Email y Password usando el patrón Strategy
   * La estrategia EmailPasswordStrategy se selecciona automáticamente
   */
  private async signIn(e: Event) {
    e.preventDefault();

    // Limpiar mensajes previos
    this.error = '';
    this.message = '';
    this.loading = true;

    try {
      console.log('🔐 Iniciando autenticación con Email/Password (Strategy Pattern)');

      // Usar AuthService con la estrategia de Email/Password
      // El servicio internamente selecciona y usa EmailPasswordStrategy
      const result: AuthResult = await authService.authenticateWithEmailPassword(this.email, this.password);

      if (result.success) {
        this.message = '✅ Login successful!';
        console.log('✅ Autenticación exitosa:', result.user);

        // Redirección después del login
        setTimeout(() => {
          window.location.href = this.redirectAfterLogin;
        }, 1500);
      } else {
        this.error = result.error || 'Error de autenticación';
        console.error('❌ Error en autenticación:', result.error);
      }
    } catch (err) {
      this.error = `Error: ${err instanceof Error ? err.message : 'Error desconocido'}`;
      console.error('❌ Error en signIn:', err);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Maneja el login con Google OAuth usando el patrón Strategy
   * La estrategia GoogleOAuthStrategy se selecciona automáticamente
   */
  private async signInWithGoogle() {
    try {
      // Limpiar mensajes previos
      this.error = '';
      this.message = 'Redirigiendo a Google...';
      this.loading = true;

      console.log('🔐 Iniciando autenticación con Google OAuth (Strategy Pattern)');

      // Usar AuthService con la estrategia de Google OAuth
      // El servicio internamente selecciona y usa GoogleOAuthStrategy
      const result: AuthResult = await authService.authenticateWithGoogle('http://localhost:5173');

      if (result.success) {
        console.log('✅ Redirección a Google iniciada');
        // La redirección a Google se maneja automáticamente por la estrategia
        // No necesitamos hacer nada más aquí
      } else {
        this.error = result.error || 'Error al iniciar autenticación con Google';
        console.error('❌ Error en Google OAuth:', result.error);
        this.loading = false;
      }
    } catch (err) {
      this.error = 'Error starting Google auth';
      console.error('❌ Error en signInWithGoogle:', err);
      this.loading = false;
    }
  }

  /**
   * Maneja el callback de Google OAuth después de la redirección
   * Usa la estrategia GoogleOAuthStrategy para procesar el callback
   */
  private async handleGoogleCallback() {
    try {
      console.log('🔄 Procesando callback de Google OAuth (Strategy Pattern)');

      // Usar AuthService para manejar el callback de Google
      // El servicio delega a GoogleOAuthStrategy.handleCallback()
      const result: AuthResult = await authService.handleOAuthCallback('google-oauth');

      if (result.success) {
        console.log('✅ Callback de Google procesado exitosamente:', result.user);
        this.message = '✅ Login with Google successful!';

        // Limpiar parámetros de OAuth de la URL
        GoogleOAuthStrategy.cleanOAuthParams();

        // Redirección después del login con el token en la URL
        const token = result.accessToken;
        setTimeout(() => {
          const redirectUrl = new URL(this.redirectAfterLogin);
          redirectUrl.searchParams.set('access_token', token || '');
          if (result.user) {
            redirectUrl.searchParams.set('user_id', result.user.id || '');
            redirectUrl.searchParams.set('user_email', result.user.email || '');
          }
          window.location.href = redirectUrl.toString();
        }, 1500);
      } else {
        console.error('❌ Error procesando callback:', result.error);
        this.error = result.error || 'Error processing Google authentication';
      }
    } catch (err) {
      console.error('❌ Error handling Google callback:', err);
      this.error = 'Error processing authentication';
    }
  }

  /**
   * Verifica si estamos en una página de callback OAuth al cargar el componente
   */
  componentDidLoad() {
    // Verificar si estamos en un callback de OAuth
    if (GoogleOAuthStrategy.isOAuthCallback()) {
      console.log('📍 Detectado callback de OAuth, procesando...');
      this.handleGoogleCallback();
    }
  }

  render() {
    const imageSrc = getAssetPath(`./assets/${this.image}`);

    return (
      <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="grid grid-cols-2 items-stretch w-full max-w-7xl bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: this.height }}>
          {/* Columna Izquierda - Login */}
          <div class="flex items-center justify-center p-12 h-full">
            <form class="w-full max-w-md space-y-6">
              {/* Icono superior */}
              <div class="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-blue-600">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75M6.75 10.5h10.5
                    a2.25 2.25 0 012.25 2.25v6.75a2.25 2.25 0 01-2.25
                    2.25H6.75a2.25 2.25 0 01-2.25-2.25v-6.75
                    a2.25 2.25 0 012.25-2.25z"
                  />
                </svg>
              </div>

              <h5 class="text-2xl font-bold text-gray-900 text-center">Sign in to our platform</h5>

              {/* Mensajes de error y éxito */}
              {this.error && <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">{this.error}</div>}

              {this.message && <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">{this.message}</div>}

              {/* Botón Google - Usa GoogleOAuthStrategy */}
              <button
                onClick={() => this.signInWithGoogle()}
                type="button"
                disabled={this.loading}
                class="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google" />
                {this.loading ? 'Processing...' : 'Sign in with Google'}
              </button>

              {/* Separador */}
              <div class="flex items-center">
                <hr class="flex-grow border-gray-300" />
                <span class="px-2 text-gray-400 text-sm">or</span>
                <hr class="flex-grow border-gray-300" />
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" class="block mb-2 text-sm font-medium text-gray-900">
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  disabled={this.loading}
                  onInput={(e: any) => (this.email = e.target.value)}
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" class="block mb-2 text-sm font-medium text-gray-900">
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                  disabled={this.loading}
                  onInput={(e: any) => (this.password = e.target.value)}
                />
              </div>

              {/* Botón login con Email/Password - Usa EmailPasswordStrategy */}
              <button
                type="submit"
                onClick={e => this.signIn(e)}
                disabled={this.loading}
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {this.loading ? 'Authenticating...' : 'Login with Email'}
              </button>
            </form>
          </div>

          {/* Columna Derecha - Imagen */}
          <div class="relative overflow-hidden">
            <img src={imageSrc} alt="Authentication" class="block w-full h-full object-cover" />
          </div>
        </div>
      </div>
    );
  }
}
