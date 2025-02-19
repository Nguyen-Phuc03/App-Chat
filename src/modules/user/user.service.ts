import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { RoleEnum } from './enum/role.enum';
import { Role } from './entities/role.entity';
import config from '../../config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    @Inject(config.KEY)
    private configService: ConfigType<typeof config>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName } = createUserDto;
    const roleName = (await this.checkEmailIsAdmin(email))
      ? RoleEnum.ADMIN
      : RoleEnum.USER;
    const role = await this.roleRepository.findOne({
      where: { name: roleName },
    });

    if (!role) {
      throw new Error('Not exist role');
    }
    const user = new User();
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.roleId = role;
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'firstName', 'lastName'],
    });
  }

  async checkEmailIsAdmin(email: string): Promise<boolean> {
    return this.configService.email.adminEmails.split(',').includes(email);
  }
}
