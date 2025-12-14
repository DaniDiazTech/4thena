import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateMessageDto {
  @IsObject()
  @IsNotEmpty()
  content: Record<string, any>;
}
