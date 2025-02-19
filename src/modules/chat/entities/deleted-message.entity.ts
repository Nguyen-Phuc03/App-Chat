import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DefaultEntity } from '../../../utils/entities/default.entity';
import { Message } from './message.entity';
import { User } from '../../user/entities/user.entity';

@Entity('deleted_messages')
export class DeletedMessage extends DefaultEntity {
  @ManyToOne(() => Message, (message) => message.deletedMessages)
  @JoinColumn({ name: 'message_id' })
  message: Message;

  @Column('uuid')
  message_id: string;

  @ManyToOne(() => User, (user) => user.deletedMessages)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('uuid')
  user_id: string;
}
