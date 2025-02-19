import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserConversation } from './user-conversation.entity';
import { DefaultEntity } from '../../../utils/entities/default.entity';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation extends DefaultEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('boolean')
  is_group: boolean;

  @Column('date', { nullable: true })
  last_message_at: Date;

  @Column('varchar', { nullable: true })
  avatar: string;

  @Column('varchar')
  owner: string;

  @OneToMany(
    () => UserConversation,
    (userConversation) => userConversation.conversation,
  )
  userConversations: UserConversation[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
