import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class GetMessagesDto {
  @IsString()
  conversation_id: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
