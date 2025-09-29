import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthResolver } from './resolvers/auth.resolver';
import { UserResolver } from './resolvers/user.resolver';

// Simplified Gateway Module - GraphQL configuration will be added later
@Module({
  imports: [AuthModule],
  providers: [AuthResolver, UserResolver],
  exports: [AuthResolver, UserResolver],
})
export class GatewayModule {}
