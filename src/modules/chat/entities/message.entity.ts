import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { DefaultEntity } from '../../../utils/entities/default.entity';
import { User } from '../../user/entities/user.entity';
import { Conversation } from './conversation.entity';
import { DeletedMessage } from './deleted-message.entity';

@Entity('messages')
export class Message extends DefaultEntity {
  @ManyToOne(() => User, (user) => user.sendMessage)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column('uuid')
  sender_id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages)
  @JoinColumn({ name: 'conversation_id' })
  conversation: Conversation;

  @Column('uuid')
  conversation_id: string;

  @Column('text')
  content: string;

  @OneToMany(() => DeletedMessage, (deletedMessage) => deletedMessage.message)
  deletedMessages: DeletedMessage[];
}
