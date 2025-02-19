import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from '../auth/dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully.',
    schema: {
      example: {
        message: 'User registered successfully',
        code: HttpStatus.CREATED,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
    schema: {
      example: {
        message: 'Validation failed.',
        code: HttpStatus.BAD_REQUEST,
      },
    },
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully.',
    schema: {
      example: {
        message: 'Login successfully.',
        code: HttpStatus.OK,
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized.',
    schema: {
      example: {
        message: 'Unauthorized',
        code: HttpStatus.UNAUTHORIZED,
      },
    },
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'authorized ',
    schema: {
      example: {
        message: 'Unauthorized',
        code: HttpStatus.UNAUTHORIZED,
      },
    },
  })
  @Get('google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login with Google successfully',
    schema: {
      example: {
        message: 'Login with Google successfully',
        code: 200,
        user: {
          email: 'user@gmail.com',
          id: 'user_id',
          firstName: 'first Name',
          lastName: 'last Name',
          roleId: {
            id: 'id',
            name: 'name',
          },
          token: 'access_token',
        },
      },
    },
  })
  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    const user = req.user;
    const result = await this.authService.loginWithGoogle(user);
    return result;
  }
}
