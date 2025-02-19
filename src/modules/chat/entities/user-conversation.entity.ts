import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity('userconversations')
export class UserConversation {
  @Column('uuid', { primary: true })
  id: string;

  @ManyToOne(() => User, (user) => user.userConversations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.userConversations,
  )
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  join_at: Date;

  @Column('int', { default: 0 })
  count_unread_messages: number;
}
