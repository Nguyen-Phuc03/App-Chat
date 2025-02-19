import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthSocketMiddleware } from './middlewares/auth-socket.middleware';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('SocketGateway');

  afterInit(server: Server) {
    this.logger.log(server);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // const userId = client.data.userid;
    // this.server.emit('user-offline', { userId });
  }
  @UseGuards(AuthSocketMiddleware)
  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      const user = client.data.user;
      const conversations = await this.chatService.getUserConversations(
        user.id,
      );
      conversations.forEach((conv) => {
        client.join(`conversation-${conv.id}`);
      });
      client.data.userId = user.id;

      // this.server.emit('user:online', { userId: user.id });
    } catch (error) {
      this.logger.error(error);
      client.disconnect();
    }
  }
  @SubscribeMessage('leave-group')
  async handleLeaveGroup(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ): Promise<void> {
    try {
      const user = client.data.user;
      const { conversationId } = payload;
      const result = await this.chatService.DeleteConversation(
        conversationId,
        user.id,
      );
      client.leave(`conversation-${conversationId}`);
      this.logger.log(
        `User ${user.id} left conversation ${conversationId}, client: ${client.id}`,
      );

      if (result.message === 'Conversation deleted') {
        client.emit('conversation:deleted', {
          message: 'The conversation has been deleted as no members are left.',
          conversationId,
        });
      } else {
        this.server.to(`conversation-${conversationId}`).emit('user:left', {
          userId: user.id,
          conversationId,
        });
      }
    } catch (error) {
      this.logger.error('Error in handleLeaveGroup:', error);
      client.emit('error', { message: 'Unable to leave the group' });
    }
  }

  @SubscribeMessage('typing:start')
  async handleTypingStart(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ): Promise<void> {
    const user = client.data.user;

    client.to(`conversation-${payload.conversationId}`).emit('typing:start', {
      userId: user.id,
      conversationId: payload.conversationId,
    });
  }

  @SubscribeMessage('typing:stop')
  async handleTypingStop(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { conversationId: string },
  ): Promise<void> {
    const user = client.data.user;

    client.to(`conversation-${payload.conversationId}`).emit('typing:stop', {
      userId: user.id,
      conversationId: payload.conversationId,
    });
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ): Promise<void> {
    client.join(room);
    this.logger.log(`client id: ${client.id} joined room: ${room}`);
    this.server.to(room).emit('joined-room', `Client ${client.id} joined room`);
  }
}
