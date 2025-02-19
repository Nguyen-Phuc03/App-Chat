import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from '../auth/dto/login.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const existUser = await this.userService.findByEmail(createUserDto.email);
    if (existUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.create(createUserDto);

    const payload: JwtPayload = { userId: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      user,
      token,
    };
  }

  async login(loginDto: LoginAuthDto): Promise<AuthResponse> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);
    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const payload: JwtPayload = { userId: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      user,
      token,
    };
  }
  async loginWithGoogle(user: any): Promise<AuthResponse> {
    const payload: JwtPayload = { userId: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      user,
      token,
    };
  }
}
