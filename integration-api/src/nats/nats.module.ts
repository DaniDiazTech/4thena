import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_SERVICE',
        options: {
          servers: ['nats://nats-mq:4222'],
        },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class NatsModule {}
