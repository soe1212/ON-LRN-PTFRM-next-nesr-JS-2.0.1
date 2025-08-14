import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ 
    required: true,
    enum: [
      'COURSE_PUBLISHED',
      'ORDER_COMPLETED', 
      'PROGRESS_MILESTONE',
      'CERTIFICATE_ISSUED',
      'REVIEW_RECEIVED',
      'ANNOUNCEMENT',
      'REMINDER',
      'SYSTEM'
    ]
  })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ type: Object })
  data?: Record<string, any>;

  @Prop({ default: false })
  read: boolean;

  @Prop()
  readAt?: Date;

  @Prop({ 
    enum: ['email', 'push', 'in-app'],
    default: ['in-app']
  })
  channels: string[];

  @Prop({ default: 'normal', enum: ['low', 'normal', 'high', 'urgent'] })
  priority: string;

  @Prop()
  scheduledFor?: Date;

  @Prop({ default: 'pending', enum: ['pending', 'sent', 'failed', 'cancelled'] })
  status: string;

  @Prop()
  sentAt?: Date;

  @Prop()
  failureReason?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);