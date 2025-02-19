import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import config from './config';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          type: configService.postgres.type as 'postgres',
          host: configService.postgres.host,
          port: configService.postgres.port,
          database: configService.postgres.name,
          username: configService.postgres.username,
          password: configService.postgres.password,
          autoLoadEntities: true,
          keepConnectionAlive: true,
          // ssl: {
          //   rejectUnauthorized: false,
          // },
          logging: false,
          keepAlive: true,
        };
      },
    }),
    UserModule,
    AuthModule,
    UploadModule,
    ChatModule,
  ],
  providers: [],
})
export class AppModule {}
