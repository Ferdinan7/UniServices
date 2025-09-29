export interface ServicesConfig {
  authService: {
    url: string;
    timeout: number;
  };
  tramitesService: {
    url: string;
    timeout: number;
  };
  uniauthService: {
    url: string;
    timeout: number;
  };
  supabase: {
    url: string;
    jwksUrl: string;
  };
}

export const servicesConfig = (): ServicesConfig => ({
  authService: {
    url: process.env.AUTH_SERVICE_URL || 'http://localhost:3000/graphql',
    timeout: parseInt(process.env.AUTH_SERVICE_TIMEOUT ?? '5000', 10),
  },
  tramitesService: {
    url: process.env.TRAMITES_SERVICE_URL || 'http://localhost:3550/tramites',
    timeout: parseInt(process.env.TRAMITES_SERVICE_TIMEOUT ?? '5000', 10),
  },
  uniauthService: {
    url: process.env.UNIAUTH_SERVICE_URL || 'http://localhost:3333',
    timeout: parseInt(process.env.UNIAUTH_SERVICE_TIMEOUT ?? '5000', 10),
  },
  supabase: {
    url: process.env.SUPABASE_URL || 'https://sirtkdkbqsklncyoallp.supabase.co',
    jwksUrl:
      process.env.SUPABASE_JWKS_URL ||
      'https://sirtkdkbqsklncyoallp.supabase.co/auth/v1/.well-known/jwks.json',
  },
});
