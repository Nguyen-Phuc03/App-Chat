import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthSocketMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(client: Socket, next: any) {
    const token = client.handshake.headers['authorization'];
    if (!token) {
      return next(new Error('Unauthorized'));
    }

    try {
      const decoded = await this.jwtService.decode(token);
      client.data.user = decoded.user;
      next();
    } catch (error) {
      next(new Error(`Unauthorized ${error}`));
    }
  }
}
