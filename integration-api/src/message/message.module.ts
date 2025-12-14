import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { NatsModule } from 'src/nats/nats.module';

@Module({
  providers: [MessageService],
  exports: [MessageService],
  imports: [NatsModule]
})
export class MessageModule { }
