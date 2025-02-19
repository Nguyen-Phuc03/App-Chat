import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateConversationDto {
  @IsString()
  name: string;

  @IsBoolean()
  is_group: boolean;

  @IsOptional()
  @IsString()
  avatar?: string;

  @Column('timestamp', { nullable: true })
  last_message_at: Date;

  @IsNotEmpty()
  @IsString()
  @IsUUID('all', { each: true })
  owner: string;

  @IsNotEmpty()
  @IsArray()
  @IsUUID('all', { each: true })
  userConversations: string[];
}
