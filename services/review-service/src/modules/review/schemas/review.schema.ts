import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  title?: string;

  @Prop({ required: true })
  comment: string;

  @Prop({ default: 0 })
  helpful: number;

  @Prop({ default: [] })
  helpfulUsers: string[];

  @Prop({ default: false })
  isVerifiedPurchase: boolean;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop()
  instructorReply?: string;

  @Prop()
  instructorReplyAt?: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);