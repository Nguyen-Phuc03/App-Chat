import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create_conversation.dto';
import { ChatService } from './chat.service';
import { GetMessagesDto } from './dto/get_messages.dto';

@Controller('conversations')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async create(@Body() createConversationDto: CreateConversationDto) {
    return this.chatService.createConversation(createConversationDto);
  }

  @Delete('delete/:id')
  async Delete(@Param('id') id: string, @Body('Iduser') Iduser: string) {
    return this.chatService.DeleteConversation(id, Iduser);
  }

  @Post('add-user')
  async addUser(
    @Body('conversationName') conversationName: string,
    @Body('userId') userId: string,
  ) {
    return this.chatService.addUserToConversation(conversationName, userId);
  }
  @Get()
  async getMessages(@Query() query: GetMessagesDto) {
    const { conversation_id, page, limit } = query;
    return await this.chatService.getMessages(conversation_id, page, limit);
  }
}
