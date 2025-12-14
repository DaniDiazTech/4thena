import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    @Prop({ required: true })
    message_id: string;

    @Prop({ required: true })
    text: string;

    @Prop({ required: true })
    timestamp: number;

    @Prop({ required: true })
    direction: string;

    @Prop({ required: true })
    from: string;

    @Prop({ required: true })
    to: string;

    @Prop({ required: true })
    is_bussiness_account: boolean;

    @Prop({ required: true })
    message_type: string;

    @Prop({ required: true })
    has_media: boolean;

    @Prop()
    language_hint: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
