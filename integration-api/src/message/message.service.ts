import { Inject, Injectable } from '@nestjs/common';
import { Message } from './message.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateMessageDto } from './create-message.dto';

@Injectable()
export class MessageService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ){}

  sendMessage(newMessage: CreateMessageDto): void {
    this.natsClient.emit('hera.new.msgs', {
      merchantId: '',
      source: '',
      content: '',
    });
  }
}
