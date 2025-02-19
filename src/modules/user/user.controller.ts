import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {} from './dto/user.dto';
@ApiTags('User')
@Controller('users')
export class UserController {}
