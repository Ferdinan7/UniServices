import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => String)
  async signUp(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const data = await this.authService.signUp(email, password);
    return `User created: ${data.user?.email}`;
  }

  @Mutation(() => String)
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const data = await this.authService.signIn(email, password);
    return data.session?.access_token ?? '';
  }

  @Mutation(() => String)
  async signInComplete(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const data = await this.authService.signInComplete(email, password);
    return JSON.stringify(data);
  }

  @Mutation(() => String)
  async refreshToken(@Args('refresh_token') refresh_token: string) {
    const data = await this.authService.refreshToken(refresh_token);
    return JSON.stringify({
      access_token: data.session?.access_token,
      refresh_token: data.session?.refresh_token,
      expires_at: data.session?.expires_at,
      expires_in: data.session?.expires_in,
      token_type: data.session?.token_type || 'bearer',
    });
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard)
  async logout(@Context() ctx) {
    const token = ctx.req.headers['authorization']?.split(' ')[1];
    const result = await this.authService.logout(token);
    return JSON.stringify(result);
  }

  @Query(() => String)
  async validateToken(@Args('token') token: string) {
    const result = await this.authService.validateToken(token);
    return JSON.stringify(result);
  }

  @Query(() => String)
  @UseGuards(AuthGuard)
  async getUserInfo(@Context() ctx) {
    const token = ctx.req.headers['authorization']?.split(' ')[1];
    const userInfo = await this.authService.getUserInfo(token);
    return JSON.stringify(userInfo);
  }

  @Query(() => String)
  @UseGuards(AuthGuard)
  async me(@Context() ctx) {
    return `Hello ${ctx.req.user.email}`;
  }
}
