import { Module } from '@nestjs/common';
import { EmailsService } from './emails.service';
import { EmailsController } from './emails.controller';
import { MessageModule } from 'src/message/message.module';

@Module({
  providers: [EmailsService],
  controllers: [EmailsController],
  imports: [MessageModule]
})
export class EmailsModule { }
