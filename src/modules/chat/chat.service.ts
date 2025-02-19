import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { In, Repository } from 'typeorm';
import { CreateConversationDto } from './dto/create_conversation.dto';
import { UserConversation } from './entities/user-conversation.entity';
import { User } from '../user/entities/user.entity';
import { DeletedConversation } from './entities/DeletedConversation';
import { Message } from './entities/message.entity';
@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationService: Repository<Conversation>,
    @InjectRepository(UserConversation)
    private userConversationService: Repository<UserConversation>,
    @InjectRepository(Message)
    private readonly messageService: Repository<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(DeletedConversation)
    private deletedConversationRepository: Repository<DeletedConversation>,
  ) {}

  async getMessages(conversation_id: string, page: number, limit: number) {
    const [messages, total] = await this.messageService.findAndCount({
      where: { id: conversation_id },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      messages,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  async createConversation(dto: CreateConversationDto) {
    try {
      if (!dto.userConversations || dto.userConversations.length < 2) {
        throw new UnauthorizedException(
          'At least two users are required for a conversation',
        );
      }
      const conversations = await this.conversationService.find({
        where: {
          name: dto.name,
        },
        select: ['name'],
      });
      if (conversations.length > 0) {
        throw new ConflictException('Conversation already exists');
      }

      const users = await this.userRepository.find({
        where: {
          id: In(dto.userConversations),
        },
        select: ['id'],
      });
      if (users.length !== dto.userConversations.length) {
        throw new UnauthorizedException('Some users do not exist');
      }

      const conversation = this.conversationService.create({
        name: dto.name,
        is_group: dto.is_group,
        avatar: dto.avatar || null,
        owner: dto.owner,
        last_message_at: dto.last_message_at || null,
      });

      await this.conversationService.save(conversation);
      const userConversations = users.map((user) => {
        return this.userConversationService.create({
          user,
          conversation,
          join_at: new Date(),
          count_unread_messages: 0,
        });
      });

      await this.userConversationService.save(userConversations);
      return conversation;
    } catch (error) {
      console.error('Error in createConversation:', error);
      throw error;
    }
  }
  async DeleteConversation(conversationId: string, userId: string) {
    try {
      const conversation = await this.conversationService.findOne({
        where: { id: conversationId },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }
      const deletionRecord = this.deletedConversationRepository.create({
        conversation: { id: conversation.id },
        user: { id: userId },
        deleted_at: new Date(),
      });
      const deletePromises = [
        this.userConversationService.delete({
          conversation: { id: conversationId },
          user: { id: userId },
        }),
        this.deletedConversationRepository.save(deletionRecord),
      ];
      await Promise.all(deletePromises);

      const userConversations = await this.userConversationService.find({
        where: { conversation: { id: conversationId } },
        relations: ['user'],
      });

      if (userConversations.length === 0) {
        // conversation.deletedAt = new Date();
        // await this.conversationService.save(conversation);
        await this.conversationService.delete(conversationId);
      }
      return {
        message: 'Conversation deleted',
      };
    } catch (error) {
      console.error('Error in DeleteConversation:', error);
      throw error;
    }
  }
  async addUserToConversation(conversationName: string, userId: string) {
    try {
      const conversation = await this.conversationService.findOne({
        where: { name: conversationName },
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }
      const existingUserConversation =
        await this.userConversationService.findOne({
          where: {
            conversation: { id: conversation.id },
            user: { id: userId },
          },
        });

      if (existingUserConversation) {
        throw new ConflictException('User already in the conversation');
      }
      const newUserConversation = this.userConversationService.create({
        user,
        conversation,
        join_at: new Date(),
        count_unread_messages: 0,
      });
      await this.userConversationService.save(newUserConversation);
      return {
        message: 'User added to the conversation successfully',
      };
    } catch (error) {
      console.error('Error in addUserToConversation:', error);
      throw error;
    }
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    const userConversations = await this.userConversationService.find({
      where: { id: userId },
      relations: ['conversation'],
    });
    return userConversations.map(
      (userConversarion) => userConversarion.conversation,
    );
  }
}
