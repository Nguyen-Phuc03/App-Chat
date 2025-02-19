import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { UserConversation } from './entities/user-conversation.entity';
import { User } from '../user/entities/user.entity';
import { DeletedConversation } from './entities/DeletedConversation';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AuthSocketMiddleware } from './middlewares/auth-socket.middleware';
import { JwtModule } from '@nestjs/jwt';
import config from '../../config';
import { SocketGateway } from './socket.gateway';
import { Message } from './entities/message.entity';
import { DeletedMessage } from './entities/deleted-message.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Conversation,
      UserConversation,
      User,
      DeletedConversation,
      Message,
      DeletedMessage,
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.jwtSecret,
          signOptions: {
            expiresIn: configService.jwt.accessTokenExpiration,
          },
        };
      },
    }),
  ],
  providers: [ChatService, AuthSocketMiddleware, SocketGateway],
  controllers: [ChatController],
})
export class ChatModule {}
