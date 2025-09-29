import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';
import { AuthService } from './auth.service';
import type { User } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RolesGuard, Role } from './roles.guard';
import { Public, CurrentUser, Roles } from '../common/decorators';

export class LoginDto {
  @ApiProperty({
    example: 'usuario@ejemplo.com',
    description: 'Email del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'refresh_token_aqui',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Basic login - returns only access token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Access token',
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const access_token = await this.authService.signIn(
      loginDto.email,
      loginDto.password,
    );
    return { access_token };
  }

  @Public()
  @Post('login-complete')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Complete login - returns access and refresh tokens',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Complete authentication result',
  })
  async loginComplete(@Body() loginDto: LoginDto) {
    return this.authService.signInComplete(loginDto.email, loginDto.password);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'New tokens',
  })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User created: nuevo@ejemplo.com' },
      },
    },
  })
  async signUp(@Body() signUpDto: LoginDto) {
    const message = await this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
    );
    return { message };
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  async logout(@Request() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.logout(token);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile information',
  })
  async getProfile(@CurrentUser() user: User) {
    return user;
  }

  @Get('profile/detailed')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get detailed user information from auth service' })
  @ApiResponse({
    status: 200,
    description: 'Detailed user information',
  })
  async getDetailedProfile(@Request() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.getUserInfo(token);
  }

  @Get('validate')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate current token' })
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
  })
  async validateToken(@Request() req: any) {
    const token = req.headers.authorization?.split(' ')[1];
    return this.authService.validateToken(token);
  }

  // Protected route examples
  @Get('admin-only')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin only endpoint (example)' })
  @ApiResponse({
    status: 200,
    description: 'Admin access granted',
  })
  async adminOnly(@CurrentUser() user: User) {
    return {
      message: 'Welcome admin!',
      user: user,
    };
  }

  @Get('student-only')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Student only endpoint (example)' })
  @ApiResponse({
    status: 200,
    description: 'Student access granted',
  })
  async studentOnly(@CurrentUser() user: User) {
    return {
      message: 'Welcome student!',
      user: user,
    };
  }

  @Get('authenticated-only')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.AUTHENTICATED, Role.ADMIN, Role.STUDENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Authenticated users only (example)' })
  @ApiResponse({
    status: 200,
    description: 'Authenticated access granted',
  })
  async authenticatedOnly(@CurrentUser() user: User) {
    return {
      message: 'Welcome authenticated user!',
      user: user,
    };
  }
}
