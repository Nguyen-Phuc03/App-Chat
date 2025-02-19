import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { DefaultEntity } from '../../../utils/entities/default.entity';
import { Role } from './role.entity';
import { UserConversation } from '../../chat/entities/user-conversation.entity';
import { Message } from '../../chat/entities/message.entity';
import { DeletedMessage } from '../../chat/entities/deleted-message.entity';

@Entity('users')
export class User extends DefaultEntity {
  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;
  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'role_id' })
  roleId: Role;

  @OneToMany(
    () => UserConversation,
    (userConversation) => userConversation.user,
  )
  userConversations: UserConversation[];

  @OneToMany(() => Message, (message) => message.sender)
  sendMessage: Message[];

  @OneToMany(() => DeletedMessage, (deletedMessage) => deletedMessage.user)
  deletedMessages: DeletedMessage[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
