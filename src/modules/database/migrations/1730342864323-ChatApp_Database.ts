import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatAppDatabase1730342864323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              CREATE TABLE roles (
                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                  name VARCHAR(255) NOT NULL
              );
            `);

    await queryRunner.query(`
                CREATE TABLE users (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    email VARCHAR(255) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    first_name VARCHAR(255) NOT NULL,
                    last_name VARCHAR(255) ,
                    role_id UUID REFERENCES roles(id),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                    deleted_at TIMESTAMP NULL
                );
              `);

    await queryRunner.query(`
              INSERT INTO roles (name)
              VALUES 
                ('admin'),
                ('user');
            `);

    await queryRunner.query(`
              CREATE OR REPLACE FUNCTION update_updated_at_column()
              RETURNS TRIGGER AS $$
              BEGIN
                 NEW.updated_at = CURRENT_TIMESTAMP;
                 RETURN NEW;
              END;
              $$ LANGUAGE plpgsql;
            `);

    await queryRunner.query(`
              CREATE TRIGGER trigger_update_timestamp
              BEFORE UPDATE ON users
              FOR EACH ROW
              EXECUTE FUNCTION update_updated_at_column();
            `);
    await queryRunner.query(`
            CREATE TABLE conversations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
            name TEXT,
            is_group BOOLEAN,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP, 
            last_message_at TIMESTAMP,  
            avatar VARCHAR(50)
            );
            `);
    await queryRunner.query(`
              CREATE TABLE userconversations (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              user_id UUID NOT NULL,
              conversation_id UUID NOT NULL,
             join_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              count_unread_messages INT DEFAULT 0,
	            deleted_at TIMESTAMP,  -- For soft deletion
               FOREIGN KEY (user_id) REFERENCES users(id),
               FOREIGN KEY (conversation_id)  REFERENCES conversations(id)
              );
              `);
    await queryRunner.query(`
                CREATE TABLE deletedconversations (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
               conversation_id UUID NOT NULL,
              user_id UUID NOT NULL,
              deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id),
            FOREIGN KEY (user_id) REFERENCES users(id)
            );
                `);
    await queryRunner.query(`
                  CREATE TABLE messages (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    conversation_id UUID NOT NULL,
                    sender_id UUID NOT NULL,
                    content TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    deleted_at TIMESTAMP NULL,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
                    FOREIGN KEY (sender_id) REFERENCES users(id)
                  );
                `);

    await queryRunner.query(`
                  CREATE TABLE files (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    url TEXT NOT NULL,
                    type TEXT NOT NULL,
                    thumb_url TEXT,
                    user_id UUID NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                  );
                `);

    await queryRunner.query(`
                  CREATE TABLE filemessages (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    file_id UUID NOT NULL,
                    message_id UUID NOT NULL,
                    FOREIGN KEY (file_id) REFERENCES files(id),
                    FOREIGN KEY (message_id) REFERENCES messages(id)
                  );
                `);

    await queryRunner.query(`
                  CREATE TABLE deletedmessages (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    message_id UUID NOT NULL,
                    user_id UUID NOT NULL,
                    FOREIGN KEY (message_id) REFERENCES messages(id),
                    FOREIGN KEY (user_id) REFERENCES users(id)
                  );
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS deletedmessages;`);
    await queryRunner.query(`DROP TABLE IF EXISTS filemessages;`);
    await queryRunner.query(`DROP TABLE IF EXISTS files;`);
    await queryRunner.query(`DROP TABLE IF EXISTS messages;`);
    await queryRunner.query(`
              DROP TRIGGER IF EXISTS trigger_update_timestamp ON users;
            `);
    await queryRunner.query(`
              DROP FUNCTION IF EXISTS update_updated_at_column;
            `);

    await queryRunner.query(`
              DROP TABLE IF EXISTS users;
            `);

    await queryRunner.query(`
              DROP TABLE IF EXISTS roles;
            `);
    await queryRunner.query(`
              DROP TABLE IF EXISTS userconversations;
            `);
    await queryRunner.query(`
              DROP TABLE IF EXISTS deletedconversations;
            `);
    await queryRunner.query(`
              DROP TABLE IF EXISTS conversations;
            `);
  }
}
