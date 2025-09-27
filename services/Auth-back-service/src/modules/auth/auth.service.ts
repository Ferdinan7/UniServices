import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/lib/supabase/supabase.service';

@Injectable()
export class AuthService {
  constructor(private readonly supabase: SupabaseService) {}

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.getClient().auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(error.message);
    return data; // Retorna user y session
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
    if (error) throw new Error(error.message);
    return data; // Retorna user y session (con access_token)
  }

  async getUser(token: string) {
    const { data, error } = await this.supabase.getClient().auth.getUser(token);
    if (error) throw new Error(error.message);
    return data.user;
  }

  async refreshToken(refresh_token: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.refreshSession({
        refresh_token,
      });
    if (error) throw new Error(error.message);
    return data; // Retorna nueva session con access_token y refresh_token
  }

  async logout(token: string) {
    const { error } = await this.supabase.getClient().auth.signOut();
    if (error) throw new Error(error.message);
    return { message: 'Logout successful' };
  }

  async validateToken(token: string) {
    try {
      const { data, error } = await this.supabase
        .getClient()
        .auth.getUser(token);
      if (error || !data.user) {
        return { valid: false, error: error?.message || 'Invalid token' };
      }
      return {
        valid: true,
        user: data.user,
        expires_at: data.user.last_sign_in_at,
      };
    } catch (err) {
      return { valid: false, error: 'Token validation failed' };
    }
  }

  async getUserInfo(token: string) {
    const { data, error } = await this.supabase.getClient().auth.getUser(token);
    if (error) throw new Error(error.message);

    return {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role || 'authenticated',
      email_confirmed_at: data.user.email_confirmed_at,
      last_sign_in_at: data.user.last_sign_in_at,
      created_at: data.user.created_at,
      app_metadata: data.user.app_metadata,
      user_metadata: data.user.user_metadata,
    };
  }

  // Método mejorado para signIn que retorna toda la información necesaria
  async signInComplete(email: string, password: string) {
    const { data, error } = await this.supabase
      .getClient()
      .auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
    if (error) throw new Error(error.message);

    return {
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_at: data.session?.expires_at,
      expires_in: data.session?.expires_in,
      token_type: data.session?.token_type || 'bearer',
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.role || 'authenticated',
        email_confirmed_at: data.user?.email_confirmed_at,
        last_sign_in_at: data.user?.last_sign_in_at,
      },
    };
  }
}
