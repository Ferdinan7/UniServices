import { Component, h, State, getAssetPath, Prop } from '@stencil/core';

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

  @Prop() image: string = 'bike.png';
  @Prop() height: string = '600px';

  private backendUrl: string = 'http://localhost:3000/graphql'; // Corregido el puerto

  private async signIn(e: Event) {
    e.preventDefault();
    this.error = '';
    this.message = '';

    const query = `
      mutation {
        signInComplete(email: "${this.email}", password: "${this.password}")
      }`;

    try {
      const response = await fetch(this.backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result.errors) {
        this.error = result.errors[0].message;
      } else {
        // Parsear la respuesta del backend (viene como string JSON)
        const authData = JSON.parse(result.data.signInComplete);

        // Guardar token en localStorage para uso futuro
        if (authData.access_token) {
          localStorage.setItem('auth_token', authData.access_token);
          localStorage.setItem('refresh_token', authData.refresh_token);
          localStorage.setItem('user_info', JSON.stringify(authData.user));
        }

        this.message = 'Login successful!';

        // Redirección a YouTube después de login con email/password
        setTimeout(() => {
          window.location.href = 'https://youtube.com';
        }, 1500);
      }
    } catch (err) {
      this.error = `Error: ${err}`;
    }
  }

  private async signInWithGoogle() {
    try {
      this.error = '';

      // 👉 OAuth con Supabase usando redirección específica para Google
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://sirtkdkbqsklncyoallp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcnRrZGticXNrbG5jeW9hbGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg3NDMsImV4cCI6MjA3NDM0NDc0M30.B4EHoGBWHaW5RDPT0YbqVVrpwJ4EsWsKBt6yVbwQXAA'
      );

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirección específica para Google Auth
          redirectTo: 'http://localhost:5173',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        this.error = error.message;
      }
    } catch (err) {
      this.error = 'Error starting Google auth';
    }
  }

  // Método para manejar el callback de Google (si necesitas procesar el token)
  private async handleGoogleCallback() {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://sirtkdkbqsklncyoallp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcnRrZGticXNrbG5jeW9hbGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg3NDMsImV4cCI6MjA3NDM0NDc0M30.B4EHoGBWHaW5RDPT0YbqVVrpwJ4EsWsKBt6yVbwQXAA'
      );

      // Obtener la sesión actual después del callback
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Error getting session:', error);
        return;
      }

      if (session) {
        // Guardar tokens para uso futuro
        localStorage.setItem('auth_token', session.access_token);
        localStorage.setItem('refresh_token', session.refresh_token);
        localStorage.setItem('user_info', JSON.stringify(session.user));

        console.log('Google auth successful:', session.user);
      }
    } catch (err) {
      console.error('Error handling Google callback:', err);
    }
  }

  // Verificar si estamos en una página de callback al cargar
  componentDidLoad() {
    // Si hay parámetros de URL que indican callback de OAuth
    const urlParams = new URLSearchParams(window.location.search);
    const hasAuthCallback = urlParams.has('access_token') || urlParams.has('code');

    if (hasAuthCallback) {
      this.handleGoogleCallback();
    }
  }

  // Método de utilidad para logout
  private async logout() {
    try {
      // Limpiar localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_info');

      // Si usas Supabase, también cerrar sesión allí
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://sirtkdkbqsklncyoallp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcnRrZGticXNrbG5jeW9hbGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3Njg3NDMsImV4cCI6MjA3NDM0NDc0M30.B4EHoGBWHaW5RDPT0YbqVVrpwJ4EsWsKBt6yVbwQXAA'
      );

      await supabase.auth.signOut();

      this.message = 'Logged out successfully';
    } catch (err) {
      this.error = 'Error during logout';
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
              {this.error && (
                <div class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50">
                  {this.error}
                </div>
              )}

              {this.message && (
                <div class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50">
                  {this.message}
                </div>
              )}

              {/* Botón Google */}
              <button
                onClick={() => this.signInWithGoogle()}
                type="button"
                class="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 hover:bg-gray-50"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" alt="Google" />
                Sign in with Google
              </button>

              {/* Separador */}
              <div class="flex items-center">
                <hr class="flex-grow border-gray-300" />
                <span class="px-2 text-gray-400 text-sm">or</span>
                <hr class="flex-grow border-gray-300" />
              </div>

              {/* Inputs */}
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
                  onInput={(e: any) => (this.email = e.target.value)}
                />
              </div>

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
                  onInput={(e: any) => (this.password = e.target.value)}
                />
              </div>

              {/* Botón login */}
              <button
                type="submit"
                onClick={e => this.signIn(e)}
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Login
              </button>

            </form>
          </div>

          {/* Columna Derecha - Imagen */}
          <div class="relative overflow-hidden">
            <img src={imageSrc} alt="Motobike" class="block w-full h-full object-cover" />
          </div>
        </div>
      </div>
    );
  }
}
