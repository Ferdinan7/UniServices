import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SupabaseService } from 'src/lib/supabase/supabase.service';
import { AuthResolver } from './auth.resolver';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [AuthService, SupabaseService, AuthResolver, AuthGuard],
  exports: [AuthService, SupabaseService],
})
export class AuthModule {}
