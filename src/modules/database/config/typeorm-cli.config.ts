import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ChatAppDatabase1730342864323 } from '../migrations/1730342864323-ChatApp_Database';
import { User } from '../../../modules/user/entities/user.entity';
import { Role } from '../../../modules/user/entities/role.entity';
import { UserConversation } from '../../chat/entities/user-conversation.entity';
import { DeletedConversation } from '../../chat/entities/DeletedConversation';
import { Conversation } from '../../chat/entities/conversation.entity';
import { Message } from '../../../modules/chat/entities/message.entity';
config();

export default new DataSource({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
  logging: false,
  connectTimeoutMS: 30000,
  entities: [
    User,
    Role,
    Conversation,
    UserConversation,
    Message,
    DeletedConversation,
  ],
  migrations: [ChatAppDatabase1730342864323],
});
