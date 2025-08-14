import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DiscussionDocument = Discussion & Document;

@Schema({ timestamps: true })
export class Discussion {
  @Prop({ required: true })
  courseId: string;

  @Prop()
  lectureId?: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 'question', enum: ['question', 'discussion', 'announcement'] })
  type: string;

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop({ default: [] })
  upvotedBy: string[];

  @Prop({ default: [] })
  downvotedBy: string[];

  @Prop({ default: false })
  isPinned: boolean;

  @Prop({ default: false })
  isClosed: boolean;

  @Prop({ default: false })
  hasAcceptedAnswer: boolean;

  @Prop()
  acceptedAnswerId?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);

@Schema({ timestamps: true })
export class DiscussionReply {
  @Prop({ required: true })
  discussionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  parentReplyId?: string;

  @Prop({ default: 0 })
  upvotes: number;

  @Prop({ default: 0 })
  downvotes: number;

  @Prop({ default: [] })
  upvotedBy: string[];

  @Prop({ default: [] })
  downvotedBy: string[];

  @Prop({ default: false })
  isAccepted: boolean;

  @Prop({ default: false })
  isInstructorReply: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const DiscussionReplySchema = SchemaFactory.createForClass(DiscussionReply);