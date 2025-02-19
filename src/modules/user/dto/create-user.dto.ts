import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty({ example: 123 })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Phuc' })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Nguyen' })
  lastName: string;
}
